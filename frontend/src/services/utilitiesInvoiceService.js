import api from "./api";
import { getAllUtilitiesInvoices, getAllContracts } from "./adminService";
import { getAccounts, getResidents } from "./adminResidentService";

const toArray = (value) => (Array.isArray(value) ? value : []);

// ─── Re-exports cho tiện dùng ───────────────────────────────────────────────
export { getAllUtilitiesInvoices, getAllContracts, getAccounts, getResidents };

// ─── Mandatory Services (đơn giá điện / nước / phí quản lý) ────────────────

/**
 * GET /mandatory-services
 * serviceCode: ELEC_01 (điện), WAT_01 (nước), MNG_FEE (phí quản lý)
 */
export const getMandatoryServices = async () => {
  try {
    const res = await api.get("/mandatory-services");
    return toArray(res.data?.result);
  } catch (error) {
    console.error(
      "getMandatoryServices error:",
      error?.response?.data ?? error.message
    );
    return [];
  }
};

// ─── Normalize raw invoice data ─────────────────────────────────────────────

/**
 * Build lookup maps từ accounts, residents, contracts rồi normalize raw invoices.
 * @returns mảng invoice đã được enrich thêm ownerName, phone, floorNumber, v.v.
 */
export const normalizeInvoices = ({ rawInvoices, accounts, residents, contracts }) => {
  // accountId → account
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  // accountId → resident
  const residentMap = new Map(
    residents.map((r) => {
      const accId = r?.account?.id ?? r?.accountId;
      return [accId, r];
    })
  );

  // apartmentId → contract active nhất (status = 1 ưu tiên)
  const aptContractMap = new Map();
  contracts.forEach((c) => {
    const aptId = c?.apartment?.id ?? c?.apartmentId;
    if (!aptId) return;
    const existing = aptContractMap.get(aptId);
    if (!existing || (c?.status === 1 && existing?.status !== 1)) {
      aptContractMap.set(aptId, c);
    }
  });

  return rawInvoices.map((inv, idx) => {
    const aptId = inv?.apartment?.id ?? inv?.apartmentId;
    const roomNumber = inv?.apartment?.roomNumber ?? `#${aptId ?? idx}`;
    const floorNumber = inv?.apartment?.floorNumber ?? "N/A";

    const contract = aptContractMap.get(aptId);
    const accountId = contract?.account?.id ?? contract?.accountId;
    const account = accountMap.get(accountId);
    const resident = residentMap.get(accountId);

    const ownerName = resident?.fullName ?? account?.username ?? "N/A";
    const phone =
      resident?.phoneNumber ??
      resident?.phone ??
      account?.phoneNumber ??
      "N/A";

    return {
      id: inv.id ?? `inv-${idx}`,
      apartmentId: aptId,
      apartmentLabel: String(roomNumber),
      floorNumber,
      billingMonth: inv.billingMonth,
      billingYear: inv.billingYear,
      totalElectricUsed: inv.totalElectricUsed ?? 0,
      totalWaterUsed: inv.totalWaterUsed ?? 0,
      totalAmount: inv.totalAmount ?? 0,
      status: Number(inv?.status ?? 0),
      ownerName,
      phone,
    };
  });
};
