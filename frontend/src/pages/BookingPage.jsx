import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../components/sections/auth/AuthContext";
import {
  createBooking,
  getServiceResources,
  getServices,
} from "../services/serviceService";

import "../styles/booking.css";

const visitTimes = [
  { label: "Morning", value: "08:00" },
  { label: "Afternoon", value: "13:00" },
  { label: "Evening", value: "18:00" },
];

const durationOptions = [1, 2, 3, 4];

const formatCurrency = (value) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "Contact management";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const toDateTimeString = (date, time) => {
  if (!date || !time) return "";
  return `${date}T${time}:00`;
};

const padNumber = (value) => String(value).padStart(2, "0");

const formatLocalDateTime = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate()
  )}T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(
    date.getSeconds()
  )}`;
};

export default function BookingPage() {
  const { user, role } = useAuth();
  const [services, setServices] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [survey, setSurvey] = useState({
    preferredDate: "",
    preferredTime: visitTimes[0].value,
    durationHours: durationOptions[0],
    note: "",
  });

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        setFeedback({ type: "", message: "" });

        const [serviceData, resourceData] = await Promise.all([
          getServices(),
          getServiceResources(),
        ]);

        setServices(serviceData);
        setResources(resourceData);
        setSelectedServiceId(serviceData[0]?.id ?? null);
      } catch (error) {
        console.error("Error loading booking data:", error);
        setFeedback({
          type: "error",
          message: "Khong the tai du lieu booking tu backend.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0] ?? null,
    [services, selectedServiceId]
  );

  const serviceResources = useMemo(() => {
    if (!selectedService?.id) return [];

    return resources.filter((resource) => resource.serviceId === selectedService.id);
  }, [resources, selectedService]);

  const availableResources = useMemo(
    () => serviceResources.filter((resource) => resource.isAvailable !== false),
    [serviceResources]
  );

  const selectedResource = useMemo(
    () =>
      availableResources.find((resource) => resource.id === selectedResourceId) ??
      availableResources[0] ??
      null,
    [availableResources, selectedResourceId]
  );

  useEffect(() => {
    setSelectedResourceId(availableResources[0]?.id ?? null);
  }, [selectedServiceId, availableResources]);

  const handleSurveyChange = (event) => {
    const { name, value } = event.target;
    setSurvey((current) => ({ ...current, [name]: value }));
  };

  const canSubmit =
    role === "RESIDENT" &&
    !!user?.id &&
    !!selectedService &&
    !!selectedResource &&
    !!survey.preferredDate &&
    !!survey.preferredTime;

  const bookingAmount = useMemo(() => {
    if (selectedService?.feePerUnit === null || selectedService?.feePerUnit === undefined) {
      return null;
    }

    const fee = Number(selectedService.feePerUnit);
    const duration = Number(survey.durationHours);

    if (Number.isNaN(fee) || Number.isNaN(duration)) return null;

    return fee * duration;
  }, [selectedService, survey.durationHours]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setFeedback({
        type: "error",
        message: "Ban can dang nhap tai khoan resident de gui booking.",
      });
      return;
    }

    if (role !== "RESIDENT") {
      setFeedback({
        type: "error",
        message: "Chi tai khoan resident moi co the tao booking dich vu.",
      });
      return;
    }

    if (!selectedResource) {
      setFeedback({
        type: "error",
        message: "Dich vu nay hien chua co resource kha dung de dat lich.",
      });
      return;
    }

    const startDateTime = new Date(
      toDateTimeString(survey.preferredDate, survey.preferredTime)
    );

    if (Number.isNaN(startDateTime.getTime())) {
      setFeedback({
        type: "error",
        message: "Thoi gian booking khong hop le.",
      });
      return;
    }

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + Number(survey.durationHours));

    try {
      setIsSubmitting(true);
      setFeedback({ type: "", message: "" });

      await createBooking({
        resourceId: selectedResource.id,
        accountId: user.id,
        bookFrom: formatLocalDateTime(startDateTime),
        bookTo: formatLocalDateTime(endDateTime),
        status: 0,
        totalAmount: bookingAmount,
      });

      setFeedback({
        type: "success",
        message: "Gui booking thanh cong. Ban co the theo doi trang thai tu backend.",
      });
      setSurvey((current) => ({
        ...current,
        preferredDate: "",
        preferredTime: visitTimes[0].value,
        durationHours: durationOptions[0],
        note: "",
      }));
    } catch (error) {
      console.error("Error creating booking:", error);
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Gui booking that bai. Vui long thu lai.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar solid />

      <main className="booking-page">
        <section className="booking-hero">
          <div className="container">
            <p className="booking-eyebrow">Service Booking</p>
            <h1>Book real services from backend data and send your request directly.</h1>
            <p className="booking-hero-copy">
              Chon dich vu, resource va khung gio phu hop. Phan booking nay da duoc dong bo
              voi du lieu `/services`, `/service-resource` va submit len `/bookings`.
            </p>
          </div>
        </section>

        <section className="booking-layout container">
          <div className="booking-survey-panel">
            <div className="booking-panel-header">
              <span className="booking-step">Step 1</span>
              <h2>Booking form</h2>
              <p>Chon dich vu that, resource that va gui booking ngay tren frontend.</p>
            </div>

            {feedback.message ? (
              <div
                className={`booking-feedback booking-feedback-${feedback.type || "info"}`}
                role="alert"
              >
                {feedback.message}
              </div>
            ) : null}

            {isLoading ? (
              <div className="booking-empty-state">Dang tai danh sach dich vu va resource...</div>
            ) : (
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="booking-field-grid">
                  <label className="booking-field">
                    <span>Preferred date</span>
                    <input
                      type="date"
                      name="preferredDate"
                      value={survey.preferredDate}
                      onChange={handleSurveyChange}
                    />
                  </label>

                  <label className="booking-field">
                    <span>Preferred time</span>
                    <select
                      name="preferredTime"
                      value={survey.preferredTime}
                      onChange={handleSurveyChange}
                    >
                      {visitTimes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} ({item.value})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="booking-field">
                    <span>Duration</span>
                    <select
                      name="durationHours"
                      value={survey.durationHours}
                      onChange={handleSurveyChange}
                    >
                      {durationOptions.map((item) => (
                        <option key={item} value={item}>
                          {item} hour{item > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="booking-field">
                    <span>Selected account</span>
                    <input
                      type="text"
                      value={user?.username || "Chua dang nhap"}
                      readOnly
                    />
                  </label>
                </div>

                <div className="booking-service-picker">
                  <div className="booking-picker-header">
                    <span className="booking-step">Step 2</span>
                    <h3>Select your service</h3>
                    <p>Danh sach nay dang lay truc tiep tu backend `/services`.</p>
                  </div>

                  <div className="booking-service-options">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`booking-service-option ${
                          selectedService?.id === service.id ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedService"
                          value={service.id}
                          checked={selectedService?.id === service.id}
                          onChange={() => setSelectedServiceId(service.id)}
                        />
                        <span className="booking-service-title">{service.title}</span>
                        <span className="booking-service-desc">{service.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="booking-field">
                  <span>Available resource</span>
                  <select
                    name="selectedResource"
                    value={selectedResource?.id ?? ""}
                    onChange={(event) => setSelectedResourceId(Number(event.target.value))}
                    disabled={!availableResources.length}
                  >
                    {!availableResources.length ? (
                      <option value="">No resource available</option>
                    ) : (
                      availableResources.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                          {resource.resourceCode || `Resource #${resource.id}`} -{" "}
                          {resource.location || "No location"}
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <label className="booking-field">
                  <span>Special request</span>
                  <textarea
                    name="note"
                    rows="4"
                    placeholder="Frontend da luu tru noi dung nay de nguoi dung xem lai. Neu backend them field note sau nay minh co the noi tiep."
                    value={survey.note}
                    onChange={handleSurveyChange}
                  />
                </label>

                <div className="booking-summary-box">
                  <p className="booking-summary-label">Current selection</p>
                  <h3>{selectedService?.title || "No service selected"}</h3>
                  <p>{selectedService?.desc || "Chon dich vu de xem thong tin booking."}</p>
                  <p>
                    Resource:{" "}
                    {selectedResource
                      ? `${selectedResource.resourceCode || `#${selectedResource.id}`} - ${
                          selectedResource.location || "No location"
                        }`
                      : "Chua co resource"}
                  </p>
                  <p>
                    Estimated total:{" "}
                    {bookingAmount === null ? "Chua tinh duoc" : formatCurrency(bookingAmount)}
                  </p>
                </div>

                <button
                  type="submit"
                  className="booking-submit-btn"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Booking"}
                </button>

                {role !== "RESIDENT" ? (
                  <p className="booking-submit-hint">
                    Ban can dang nhap bang tai khoan resident de gui booking.
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <div className="booking-visual-panel">
            <div className="booking-visual-hero">
              {selectedService?.image ? (
                <img src={selectedService.image} alt={selectedService.title} />
              ) : (
                <div className="booking-image-placeholder">No image</div>
              )}
              <div className="booking-visual-overlay">
                <p className="booking-step">Selected service</p>
                <h2>{selectedService?.title || "Waiting for service data"}</h2>
                <p>{selectedService?.tagline || "Backend data will appear here."}</p>
              </div>
            </div>

            <div className="booking-areas">
              <div className="booking-picker-header">
                <span className="booking-step">Step 3</span>
                <h3>Service areas synced with your choice</h3>
                <p>Phan hinh anh va khu vuc van duoc giu dong bo theo dich vu dang chon.</p>
              </div>

              <div className="booking-area-grid">
                {selectedService?.areas?.length ? (
                  selectedService.areas.map((area) => (
                    <article key={area.name} className="booking-area-card">
                      <img src={area.image} alt={area.name} />
                      <div className="booking-area-content">
                        <h4>{area.name}</h4>
                        <p>{area.description}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="booking-empty-state">
                    Chua co hinh anh mo ta khu vuc cho dich vu nay.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
