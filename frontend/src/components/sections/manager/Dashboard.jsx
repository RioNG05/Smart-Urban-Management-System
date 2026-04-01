import React, { useState, useEffect, useMemo } from 'react';
import { FaBuilding, FaUsers, FaWrench, FaMoneyBillWave } from 'react-icons/fa';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { getApartments } from '../../../services/apartmentService';
import { getAccounts, getResidents } from '../../../services/adminResidentService';
import { getAllBookings, getAllComplaints, getAllContracts, getAllServiceInvoices, getAllUtilitiesInvoices } from '../../../services/adminService';

const Dashboard = () => {
    const [dashboardState, setDashboardState] = useState({
        apartments: [],
        accounts: [],
        residents: [],
        bookings: [],
        complaints: [],
        contracts: [],
        utilityInvoices: [],
        serviceInvoices: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            try {
                setIsLoading(true);
                setError("");

                const [
                    apartments,
                    accounts,
                    residents,
                    bookings,
                    complaints,
                    contracts,
                    utilityInvoices,
                    serviceInvoices,
                ] = await Promise.all([
                    getApartments(),
                    getAccounts(),
                    getResidents(),
                    getAllBookings(),
                    getAllComplaints(),
                    getAllContracts(),
                    getAllUtilitiesInvoices(),
                    getAllServiceInvoices(),
                ]);

                if (!active) return;

                setDashboardState({
                    apartments,
                    accounts,
                    residents,
                    bookings,
                    complaints,
                    contracts,
                    utilityInvoices,
                    serviceInvoices,
                });
            } catch (loadError) {
                if (!active) return;
                setError(
                    loadError?.response?.data?.message ||
                    "Could not load admin dashboard data from backend."
                );
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const currentDate = new Date();
    const monthFormatter = useMemo(() => new Intl.DateTimeFormat("en-US", { month: "short" }), []);
    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "VND",
                notation: "compact",
                maximumFractionDigits: 1,
            }),
        []
    );

    const monthBuckets = useMemo(() => {
        return Array.from({ length: 6 }, (_, index) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            return {
                key,
                label: monthFormatter.format(date),
                date,
            };
        });
    }, [currentDate, monthFormatter]);

    const monthIndexByKey = useMemo(
        () => new Map(monthBuckets.map((bucket, index) => [bucket.key, index])),
        [monthBuckets]
    );

    const statCards = useMemo(() => {
        const residentAccounts = dashboardState.accounts.filter(
            (account) => account?.role?.roleName?.toUpperCase() === "RESIDENT"
        );
        const activeResidents = residentAccounts.filter((account) => account?.isActive !== false).length;
        const openRequests = dashboardState.bookings.filter((booking) => Number(booking?.status) === 0).length
            + dashboardState.complaints.filter((complaint) => {
                const status = String(complaint?.status ?? "").toLowerCase();
                return status && status !== "resolved" && status !== "closed";
            }).length;

        const currentMonthRevenue = [
            ...dashboardState.utilityInvoices,
            ...dashboardState.serviceInvoices,
        ].reduce((sum, invoice) => {
            const sourceDate = invoice?.paymentDate || invoice?.createdAt;
            if (!sourceDate) return sum;

            const parsed = new Date(sourceDate);
            if (Number.isNaN(parsed.getTime())) return sum;
            if (
                parsed.getFullYear() !== currentDate.getFullYear() ||
                parsed.getMonth() !== currentDate.getMonth()
            ) {
                return sum;
            }

            return sum + Number(invoice?.amount ?? invoice?.totalAmount ?? 0);
        }, 0);

        return [
            { title: 'Total Apartments', value: dashboardState.apartments.length.toLocaleString(), icon: <FaBuilding />, color: '#3b82f6', bg: '#eff6ff' },
            { title: 'Active Residents', value: activeResidents.toLocaleString(), icon: <FaUsers />, color: '#10b981', bg: '#dcfce7' },
            { title: 'Open Service Requests', value: openRequests.toLocaleString(), icon: <FaWrench />, color: '#f59e0b', bg: '#fef3c7' },
            { title: 'Monthly Revenue', value: currencyFormatter.format(currentMonthRevenue || 0), icon: <FaMoneyBillWave />, color: '#ef4444', bg: '#fee2e2' }
        ];
    }, [currencyFormatter, currentDate, dashboardState]);

    const apartmentRevenueData = useMemo(() => {
        const rows = monthBuckets.map((bucket) => ({
            month: bucket.label,
            rent: 0,
            utilities: 0,
            management: 0,
        }));

        dashboardState.contracts.forEach((contract) => {
            const monthlyRent = Number(contract?.monthlyRent ?? 0);
            if (!monthlyRent) return;

            monthBuckets.forEach((bucket, index) => {
                const monthStart = new Date(bucket.date.getFullYear(), bucket.date.getMonth(), 1);
                const monthEnd = new Date(bucket.date.getFullYear(), bucket.date.getMonth() + 1, 0);
                const startDate = contract?.startDate ? new Date(contract.startDate) : null;
                const endDate = contract?.endDate ? new Date(contract.endDate) : null;

                const started = !startDate || !Number.isNaN(startDate.getTime()) && startDate <= monthEnd;
                const notEnded = !endDate || !Number.isNaN(endDate.getTime()) && endDate >= monthStart;

                if (started && notEnded) {
                    rows[index].rent += monthlyRent;
                }
            });
        });

        dashboardState.utilityInvoices.forEach((invoice) => {
            const key = `${invoice?.billingYear}-${String(invoice?.billingMonth).padStart(2, "0")}`;
            const index = monthIndexByKey.get(key);
            if (index === undefined) return;

            rows[index].utilities += Number(invoice?.totalAmount ?? invoice?.totalElectricUsed ?? 0) + Number(invoice?.totalWaterUsed ?? 0);
        });

        dashboardState.serviceInvoices.forEach((invoice) => {
            const sourceDate = invoice?.paymentDate || invoice?.createdAt;
            if (!sourceDate) return;
            const parsed = new Date(sourceDate);
            if (Number.isNaN(parsed.getTime())) return;

            const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
            const index = monthIndexByKey.get(key);
            if (index === undefined) return;

            rows[index].management += Number(invoice?.amount ?? 0);
        });

        return rows;
    }, [dashboardState, monthBuckets, monthIndexByKey]);

    const serviceChartMeta = useMemo(() => {
        const serviceTotals = new Map();

        dashboardState.serviceInvoices.forEach((invoice) => {
            const serviceName =
                invoice?.bookingService?.serviceResource?.service?.serviceName ||
                invoice?.bookingService?.serviceResource?.serviceName ||
                invoice?.bookingService?.serviceName ||
                "Other Services";

            serviceTotals.set(
                serviceName,
                (serviceTotals.get(serviceName) ?? 0) + Number(invoice?.amount ?? 0)
            );
        });

        return Array.from(serviceTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name], index) => ({
                key: `service_${index}`,
                name,
                color: ['#3b82f6', '#10b981', '#c89b3c', '#ef4444', '#8b5cf6', '#f59e0b'][index],
            }));
    }, [dashboardState.serviceInvoices]);

    const serviceRevenueData = useMemo(() => {
        const rows = monthBuckets.map((bucket) => {
            const baseRow = { month: bucket.label };
            serviceChartMeta.forEach((item) => {
                baseRow[item.key] = 0;
            });
            return baseRow;
        });

        const nameToKeyMap = new Map(serviceChartMeta.map((item) => [item.name, item.key]));

        dashboardState.serviceInvoices.forEach((invoice) => {
            const sourceDate = invoice?.paymentDate || invoice?.createdAt;
            if (!sourceDate) return;
            const parsed = new Date(sourceDate);
            if (Number.isNaN(parsed.getTime())) return;

            const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
            const index = monthIndexByKey.get(key);
            if (index === undefined) return;

            const serviceName =
                invoice?.bookingService?.serviceResource?.service?.serviceName ||
                invoice?.bookingService?.serviceResource?.serviceName ||
                invoice?.bookingService?.serviceName ||
                "Other Services";
            const dataKey = nameToKeyMap.get(serviceName);

            if (dataKey) {
                rows[index][dataKey] += Number(invoice?.amount ?? 0);
            }
        });

        return rows;
    }, [dashboardState.serviceInvoices, monthBuckets, monthIndexByKey, serviceChartMeta]);

    return (
        <div className="dashboard-content staff-form-container" style={{ paddingBottom: '40px' }}>
            <header className="content-header" style={{ marginBottom: '30px' }}>
                <h2 style={{ fontWeight: 'bold', color: '#333' }}>Admin Dashboard Overview</h2>
                <p style={{ color: '#c98b3c', fontWeight: 'bold' }}>Real-time building management metrics</p>
            </header>

            {error ? (
                <div className="admin-feedback error" style={{ marginBottom: '20px' }}>
                    {error}
                </div>
            ) : null}

            {/* Quick Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {statCards.map((stat, i) => (
                    <div key={i} style={{ padding: '20px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #f1f5f9', transition: 'transform 0.2s ease', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{stat.title}</p>
                            <h3 style={{ margin: '5px 0 0', color: '#1e293b', fontSize: '26px', fontWeight: '800' }}>{isLoading ? '...' : stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                {/* Apartment Revenue Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', fontWeight: '800', marginBottom: '20px' }}>Apartment Revenue Breakdown</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={apartmentRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorMgmt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => currencyFormatter.format(val)} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', padding: '10px' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                                <Area type="monotone" dataKey="rent" name="Contract Rent" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRent)" stackId="1" />
                                <Area type="monotone" dataKey="utilities" name="Utilities" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUtil)" stackId="1" />
                                <Area type="monotone" dataKey="management" name="Service Invoices" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorMgmt)" stackId="1" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Revenue Chart */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '16px', color: '#1e293b', fontWeight: '800', marginBottom: '20px' }}>Service Revenue (Monthly)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => currencyFormatter.format(val)} />
                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', padding: '10px' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                                {serviceChartMeta.map((item, index) => (
                                    <Bar
                                        key={item.key}
                                        dataKey={item.key}
                                        name={item.name}
                                        fill={item.color}
                                        stackId="a"
                                        barSize={35}
                                        radius={index === serviceChartMeta.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
