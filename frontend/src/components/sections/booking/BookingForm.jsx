import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { getCurrentUser } from "../../../services/authService";
import { createNotification } from "../../../services/notificationService";
import {
  createBooking,
  getAllBookings,
  getBookingVisibleServices,
  getServiceResources,
} from "../../../services/serviceService";
import { useBookedSlots } from "../../../hooks/useBookedSlots";
import BookingSidebar from "./BookingSidebar";
import BookingTimeGrid from "./BookingTimeGrid";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatCurrency = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return "Contact management";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
};

const pad = (v) => String(v).padStart(2, "0");

export const formatLocalDateTime = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

export const makeDateTime = (date, hour) => {
  if (!date || hour == null) return null;
  if (hour === 24) {
    const d = new Date(`${date}T00:00:00`);
    if (isNaN(d.getTime())) return null;
    d.setDate(d.getDate() + 1);
    return d;
  }
  const d = new Date(`${date}T${pad(hour)}:00:00`);
  return isNaN(d.getTime()) ? null : d;
};

const formatTimeLabel = (hour) => `${pad(hour % 24)}:00`;

const extractErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "We could not submit your booking. Please try again.";

/** Compute the minimum bookable date and earliest hour for that date (24h advance) */
const getMinBookable = () => {
  const now = new Date();
  const minTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const minDate = minTime.toISOString().slice(0, 10);
  // e.g. if now is 14:30 on Apr 4, minTime is 14:30 Apr 5, earliest slot is 15:00 Apr 5
  const earliestHour = minTime.getHours() + 1; // round up to next full hour
  return { minDate, minDateObj: minTime, earliestHour };
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingForm({ onBookingSuccess }) {
  const { role } = useAuth();
  const formTopRef = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const [account, setAccount] = useState(null);
  const [services, setServices] = useState([]);
  const [resources, setResources] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Selections ────────────────────────────────────────────────────────────
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeResourceSlideIndex, setActiveResourceSlideIndex] = useState(0);

  // ── Schedule ──────────────────────────────────────────────────────────────
  const [preferredDate, setPreferredDate] = useState("");
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const reqs = [getBookingVisibleServices(), getServiceResources(), getAllBookings()];
        if (localStorage.getItem("token")) reqs.push(getCurrentUser());
        const [svc, res, bk, acc] = await Promise.all(reqs);
        setServices(svc);
        setResources(res);
        setAllBookings(bk ?? []);
        setAccount(acc ?? null);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load booking data.", { position: "bottom-left" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const bookableServices = useMemo(() => {
    const ids = new Set(
      resources.filter((r) => r?.serviceId && r.isAvailable !== false).map((r) => r.serviceId)
    );
    return services.filter((s) => s.isBookable === true && ids.has(s.id));
  }, [services, resources]);

  useEffect(() => {
    if (!bookableServices.some((s) => s.id === selectedServiceId)) {
      setSelectedServiceId(null);
    }
  }, [bookableServices, selectedServiceId]);

  const selectedService = useMemo(
    () => bookableServices.find((s) => s.id === selectedServiceId) ?? null,
    [bookableServices, selectedServiceId]
  );

  const availableResources = useMemo(() => {
    if (!selectedService?.id) return [];
    return resources.filter((r) => r.serviceId === selectedService.id && r.isAvailable !== false);
  }, [resources, selectedService]);

  const selectedResource = useMemo(
    () => availableResources.find((r) => r.id === selectedResourceId) ?? availableResources[0] ?? null,
    [availableResources, selectedResourceId]
  );

  useEffect(() => {
    setSelectedResourceId(availableResources[0]?.id ?? null);
    setStartHour(null);
    setEndHour(null);
  }, [selectedServiceId]);

  // ── Carousel ──────────────────────────────────────────────────────────────
  const carouselImages = useMemo(() => {
    if (!selectedService) return [];
    const seen = new Set();
    return [...(selectedService.imageUrls ?? []), selectedService.image].filter((img) => {
      const s = String(img ?? "").trim();
      if (!s || seen.has(s)) return false;
      seen.add(s);
      return true;
    });
  }, [selectedService]);

  useEffect(() => { setActiveSlideIndex(0); }, [selectedServiceId]);

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const id = setInterval(() => setActiveSlideIndex((i) => (i + 1) % carouselImages.length), 4000);
    return () => clearInterval(id);
  }, [carouselImages.length]);

  const resourceCarouselImages = useMemo(() => {
    if (!selectedResource) return [];
    const seen = new Set();
    return [...(selectedResource.imageUrls ?? []), selectedResource.imageUrl].filter((img) => {
      const s = String(img ?? "").trim();
      if (!s || seen.has(s)) return false;
      seen.add(s);
      return true;
    });
  }, [selectedResource]);

  useEffect(() => { setActiveResourceSlideIndex(0); }, [selectedResourceId]);

  useEffect(() => {
    if (resourceCarouselImages.length <= 1) return;
    const id = setInterval(
      () => setActiveResourceSlideIndex((i) => (i + 1) % resourceCarouselImages.length),
      4000
    );
    return () => clearInterval(id);
  }, [resourceCarouselImages.length]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  const scrollTo = (ref) => {
    setTimeout(() => {
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleSelectService = (id) => {
    setSelectedServiceId(id);
    scrollTo(step2Ref);
  };

  const handleSelectResource = (id) => {
    setSelectedResourceId(id);
    setStartHour(null);
    setEndHour(null);
  };

  // ── Min bookable date/hour (24h advance) ──────────────────────────────────
  const { minDate, earliestHour } = useMemo(() => getMinBookable(), []);

  const disabledStartHours = useMemo(() => {
    const s = new Set();
    if (preferredDate === minDate) {
      for (let h = 8; h < earliestHour; h++) s.add(h);
    }
    return s;
  }, [preferredDate, minDate, earliestHour]);

  // ── Booked slots ──────────────────────────────────────────────────────────
  const bookedHours = useBookedSlots(allBookings, selectedResource?.id ?? null, preferredDate);

  // ── End hour disabled set ─────────────────────────────────────────────────
  const disabledEndHours = useMemo(() => {
    const disabled = new Set();
    for (let h = 9; h <= 24; h++) {
      if (startHour != null && h <= startHour) { disabled.add(h); continue; }
      if (startHour != null) {
        let crosses = false;
        for (let c = startHour; c < h; c++) {
          if (bookedHours.has(c)) { crosses = true; break; }
        }
        if (crosses) disabled.add(h);
      }
    }
    return disabled;
  }, [startHour, bookedHours]);

  useEffect(() => {
    if (endHour != null && disabledEndHours.has(endHour)) setEndHour(null);
  }, [disabledEndHours, endHour]);

  useEffect(() => {
    if (startHour != null && endHour != null && endHour <= startHour) setEndHour(null);
  }, [startHour, endHour]);

  // ── Amounts ───────────────────────────────────────────────────────────────
  const durationHours = useMemo(() => {
    if (startHour == null || endHour == null) return null;
    return endHour - startHour;
  }, [startHour, endHour]);

  const bookingAmount = useMemo(() => {
    if (selectedService?.feePerUnit == null || durationHours == null) return null;
    const fee = Number(selectedService.feePerUnit);
    return isNaN(fee) ? null : fee * durationHours;
  }, [selectedService, durationHours]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const canSubmit =
    role !== "USER" &&
    !!account?.id &&
    !!selectedService &&
    !!selectedResource &&
    !!preferredDate &&
    startHour != null &&
    endHour != null &&
    endHour > startHour;

  const handleReset = useCallback(() => {
    setSelectedServiceId(null);
    setSelectedResourceId(null);
    setPreferredDate("");
    setStartHour(null);
    setEndHour(null);
    setTimeout(() => {
      formTopRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, []);

  const saveBookingNotification = useCallback(
    async ({ status, errorMessage }) => {
      if (!account?.id || !selectedService || !selectedResource) return;

      const dateLabel = preferredDate || "your selected date";
      const timeLabel =
        startHour != null && endHour != null
          ? `${formatTimeLabel(startHour)} - ${formatTimeLabel(endHour)}`
          : null;
      const scheduleLabel = [dateLabel, timeLabel].filter(Boolean).join(" ");
      const resourceLabel =
        selectedResource.resourceCode || selectedResource.location || `resource #${selectedResource.id}`;
      const relatedUrl = "/booking";

      const payload =
        status === "success"
          ? {
              receiverId: account.id,
              title: "Booking request submitted",
              message: `Your request for ${selectedService.title} at ${resourceLabel}${scheduleLabel ? ` on ${scheduleLabel}` : ""} has been sent successfully and is waiting for review.`,
              type: "BOOKING_SUBMITTED",
              relatedUrl,
            }
          : {
              receiverId: account.id,
              title: "Booking request failed",
              message: `Your request for ${selectedService.title}${scheduleLabel ? ` on ${scheduleLabel}` : ""} could not be sent.${errorMessage ? ` Reason: ${errorMessage}` : ""}`,
              type: "BOOKING_SUBMIT_FAILED",
              relatedUrl,
            };

      try {
        await createNotification(payload);
      } catch (notificationError) {
        console.error("Failed to save booking notification", notificationError);
      }
    },
    [account?.id, endHour, preferredDate, selectedResource, selectedService, startHour]
  );

  const saveAdminBookingNotification = useCallback(async () => {
    if (!account?.id || !selectedService || !selectedResource) return;

    const dateLabel = preferredDate || "selected date";
    const timeLabel =
      startHour != null && endHour != null
        ? `${formatTimeLabel(startHour)} - ${formatTimeLabel(endHour)}`
        : null;
    const scheduleLabel = [dateLabel, timeLabel].filter(Boolean).join(" ");
    const resourceLabel =
      selectedResource.resourceCode || selectedResource.location || `resource #${selectedResource.id}`;
    const requesterLabel =
      account?.fullName || account?.username || account?.email || `account #${account.id}`;

    try {
      await createNotification({
        targetRole: "MANAGER",
        title: "New booking request",
        message: `${requesterLabel} submitted a booking for ${selectedService.title} at ${resourceLabel}${scheduleLabel ? ` on ${scheduleLabel}` : ""}.`,
        type: "BOOKING_REVIEW_REQUIRED",
        relatedUrl: "/admin/bookings",
      });
    } catch (notificationError) {
      console.error("Failed to save admin booking notification", notificationError);
    }
  }, [account, endHour, preferredDate, selectedResource, selectedService, startHour]);

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!account?.id) {
      toast.error("We could not verify your account. Please log in again.", { position: "bottom-left" });
      return;
    }
    if (role !== "RESIDENT") {
      toast.error("Only resident accounts can place service bookings.", { position: "bottom-left" });
      return;
    }
    if (!selectedResource) {
      toast.error("No available resource for this service.", { position: "bottom-left" });
      return;
    }
    const bookFrom = makeDateTime(preferredDate, startHour);
    const bookTo = makeDateTime(preferredDate, endHour);
    if (!bookFrom || !bookTo) {
      toast.error("The selected booking time is invalid.", { position: "bottom-left" });
      return;
    }

    try {
      setIsSubmitting(true);
      await createBooking({
        resourceId: selectedResource.id,
        accountId: account.id,
        bookFrom: formatLocalDateTime(bookFrom),
        bookTo: formatLocalDateTime(bookTo),
        status: 0,
        totalAmount: bookingAmount,
      });
      await saveBookingNotification({
        status: "success",
      });
      await saveAdminBookingNotification();
      handleReset();
      if (onBookingSuccess) onBookingSuccess();
      getAllBookings().then(setAllBookings);
    } catch (err) {
      console.error(err);
      const errorMessage = extractErrorMessage(err);
      await saveBookingNotification({
        status: "failed",
        errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="booking-layout container">
        <div className="booking-form-panel">
          <div className="booking-loading-state">
            <div className="booking-spinner" />
            <p>Loading services and availability…</p>
          </div>
        </div>
        <BookingSidebar
          selectedService={null}
          selectedResource={null}
          survey={{}}
          bookingAmount={null}
          canSubmit={false}
          isSubmitting={false}
          onSubmit={() => {}}
          role={role}
        />
      </div>
    );
  }

  if (!bookableServices.length) {
    return (
      <div className="booking-layout container">
        <div className="booking-form-panel">
          <div className="booking-empty-state">
            There are currently no bookable services with available resources.
          </div>
        </div>
        <BookingSidebar
          selectedService={null}
          selectedResource={null}
          survey={{}}
          bookingAmount={null}
          canSubmit={false}
          isSubmitting={false}
          onSubmit={() => {}}
          role={role}
        />
      </div>
    );
  }

  return (
    <div className="booking-layout container">
      {/* ── Left: form ───────────────────────────────────────────────────── */}
      <div className="booking-form-panel" ref={formTopRef}>
        <form className="booking-form" onSubmit={handleSubmit}>

          {/* Step 1: Service */}
          <div className="booking-step-block">
            <div className="booking-picker-header">
              <span className="booking-step">Step 1</span>
              <h3>Select your service</h3>
              <p>Only bookable services with available resources are shown.</p>
            </div>

            <div className="booking-service-options">
              {bookableServices.map((service) => (
                <label
                  key={service.id}
                  className={`booking-service-option ${selectedService?.id === service.id ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="selectedService"
                    value={service.id}
                    checked={selectedService?.id === service.id}
                    onChange={() => handleSelectService(service.id)}
                  />
                  <span className="booking-service-title">{service.title}</span>
                </label>
              ))}
            </div>

            {/* Service detail */}
            {selectedService && (
              <div className="booking-service-detail">
                {selectedService.image && (
                  <div className="booking-service-detail-image-wrap">
                    {carouselImages.length > 1 ? (
                      <>
                        <img src={carouselImages[activeSlideIndex]} alt={selectedService.title} className="booking-service-detail-image" />
                        <div className="booking-visual-dots">
                          {carouselImages.map((_, idx) => (
                            <button key={idx} type="button"
                              className={`booking-visual-dot ${idx === activeSlideIndex ? "active" : ""}`}
                              onClick={() => setActiveSlideIndex(idx)}
                              aria-label={`Image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <img src={selectedService.image} alt={selectedService.title} className="booking-service-detail-image" />
                    )}
                  </div>
                )}
                <div className="booking-service-detail-info">
                  <div className="booking-service-detail-row">
                    <span className="booking-service-detail-label">Fee</span>
                    <span className="booking-service-detail-value booking-service-detail-fee">
                      {selectedService.feePerUnit != null
                        ? `${formatCurrency(selectedService.feePerUnit)} / ${selectedService.unitType || "unit"}`
                        : "Contact management"}
                    </span>
                  </div>
                  {selectedService.description && (
                    <div className="booking-service-detail-row">
                      <span className="booking-service-detail-label">Description</span>
                      <span className="booking-service-detail-value">{selectedService.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Resources — appears after service selected */}
          {selectedService && (
            <div className="booking-step-block" ref={step2Ref}>
              <div className="booking-picker-header">
                <span className="booking-step">Step 2</span>
                <h3>Choose a resource</h3>
                <p>Available resources for <strong>{selectedService.title}</strong>.</p>
              </div>

              {availableResources.length ? (
                <>
                  <div className="booking-area-grid">
                    {availableResources.map((resource) => {
                      const isSelected = resource.id === selectedResource?.id;
                      return (
                        <button
                          key={resource.id}
                          type="button"
                          className={`booking-area-card ${isSelected ? "active" : ""}`}
                          onClick={() => handleSelectResource(resource.id)}
                        >
                          <div className="booking-resource-visual">
                            {resource.imageUrl && (
                              <img src={resource.imageUrl} alt={resource.resourceCode || `Resource #${resource.id}`} className="booking-resource-image" />
                            )}
                            {isSelected && (
                              <span className="booking-resource-badge booking-resource-badge--selected">
                                Selected
                              </span>
                            )}
                            <h4>{resource.resourceCode || `Resource #${resource.id}`}</h4>
                          </div>
                          <div className="booking-area-content">
                            <h4>{resource.location || "Location pending"}</h4>
                            <p>Resource ID: {resource.id}. Available for immediate reservation.</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedResource && resourceCarouselImages.length > 0 && (
                    <div className="booking-service-detail">
                      <div className="booking-service-detail-image-wrap">
                        <img
                          src={resourceCarouselImages[activeResourceSlideIndex]}
                          alt={selectedResource.resourceCode || `Resource #${selectedResource.id}`}
                          className="booking-service-detail-image"
                        />
                        {resourceCarouselImages.length > 1 && (
                          <div className="booking-visual-dots">
                            {resourceCarouselImages.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className={`booking-visual-dot ${idx === activeResourceSlideIndex ? "active" : ""}`}
                                onClick={() => setActiveResourceSlideIndex(idx)}
                                aria-label={`Resource image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="booking-service-detail-info">
                        <div className="booking-service-detail-row">
                          <span className="booking-service-detail-label">Resource</span>
                          <span className="booking-service-detail-value">
                            {selectedResource.resourceCode || `Resource #${selectedResource.id}`}
                          </span>
                        </div>
                        <div className="booking-service-detail-row">
                          <span className="booking-service-detail-label">Location</span>
                          <span className="booking-service-detail-value">
                            {selectedResource.location || "Location pending"}
                          </span>
                        </div>
                        <div className="booking-service-detail-row">
                          <span className="booking-service-detail-label">Gallery</span>
                          <span className="booking-service-detail-value">
                            {resourceCarouselImages.length} image{resourceCarouselImages.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="booking-empty-state">No live resources available for this service right now.</div>
              )}
            </div>
          )}

          {/* Step 3: Schedule — appears after resource selected */}
          {selectedService && selectedResource && (
            <div className="booking-step-block" ref={step3Ref}>
              <div className="booking-picker-header">
                <span className="booking-step">Step 3</span>
                <h3>Choose your schedule</h3>
                <p>
                  Select a date and time. Slots must be at least <strong>24 hours</strong> from now.
                  Crossed-out slots are already booked.
                </p>
              </div>

              {/* Date picker — styled */}
              <div className="booking-date-picker">
                <label className="booking-date-label" htmlFor="booking-date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Preferred Date
                </label>
                <input
                  id="booking-date"
                  type="date"
                  className="booking-date-input"
                  value={preferredDate}
                  min={minDate}
                  onChange={(e) => {
                    setPreferredDate(e.target.value);
                    setStartHour(null);
                    setEndHour(null);
                  }}
                />
                {preferredDate === minDate && (
                  <p className="booking-date-hint">
                    Bookings today must start at <strong>{pad(earliestHour)}:00</strong> or later.
                  </p>
                )}
              </div>

              {/* Start time grid */}
              {preferredDate && (
                <BookingTimeGrid
                  label="Booking Time (Start)"
                  selectedHour={startHour}
                  onSelect={(h) => { setStartHour(h); setEndHour(null); }}
                  blockedHours={bookedHours}
                  disabledHours={disabledStartHours}
                  startHour={8}
                  endHour={23}
                />
              )}

              {/* End time grid */}
              {preferredDate && startHour != null && (
                <BookingTimeGrid
                  label="End Time"
                  selectedHour={endHour}
                  onSelect={setEndHour}
                  blockedHours={new Set()}
                  disabledHours={disabledEndHours}
                  startHour={9}
                  endHour={24}
                />
              )}

              {/* Duration summary */}
              {durationHours != null && (
                <div className="booking-duration-hint">
                  <span>Duration: <strong>{durationHours} hour{durationHours > 1 ? "s" : ""}</strong></span>
                  {bookingAmount != null && (
                    <span> · Estimated: <strong>{formatCurrency(bookingAmount)}</strong></span>
                  )}
                </div>
              )}
            </div>
          )}

        </form>
      </div>

      {/* ── Right: sidebar ────────────────────────────────────────────────── */}
      <BookingSidebar
        selectedService={selectedService}
        selectedResource={selectedResource}
        survey={{ preferredDate, startHour, endHour, durationHours }}
        bookingAmount={bookingAmount}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        role={role}
      />
    </div>
  );
}
