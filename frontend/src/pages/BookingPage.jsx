import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../components/sections/auth/AuthContext";
import { getMyAccount } from "../services/profileService";
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

const buildVisualSlides = (service, serviceResources, selectedResource) => {
  const seenImages = new Set();
  const slides = [];

  const appendSlide = (image, metadata = {}) => {
    const normalizedImage = String(image ?? "").trim();
    if (!normalizedImage || seenImages.has(normalizedImage)) return;

    seenImages.add(normalizedImage);
    slides.push({
      id: metadata.id || normalizedImage,
      image: normalizedImage,
      title: metadata.title || service?.title || "Booking service",
      description:
        metadata.description ||
        service?.tagline ||
        "Live backend images will rotate here automatically.",
      resourceId: metadata.resourceId ?? null,
    });
  };

  service?.imageUrls?.forEach((image, index) => {
    appendSlide(image, {
      id: `service-${service?.id || "default"}-${index}`,
      title: service?.title,
      description: service?.tagline,
    });
  });

  serviceResources.forEach((resource) => {
    const images =
      resource?.imageUrls?.length > 0 ? resource.imageUrls : [resource?.imageUrl];

    images.forEach((image, index) => {
      appendSlide(image, {
        id: `resource-${resource.id}-${index}`,
        title: resource.resourceCode || `Resource #${resource.id}`,
        description: resource.location || service?.title || "Available booking resource",
        resourceId: resource.id,
      });
    });
  });

  if (!slides.length && selectedResource?.imageUrl) {
    appendSlide(selectedResource.imageUrl, {
      id: `resource-fallback-${selectedResource.id}`,
      title: selectedResource.resourceCode || `Resource #${selectedResource.id}`,
      description: selectedResource.location || service?.title,
      resourceId: selectedResource.id,
    });
  }

  return slides;
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
  const [account, setAccount] = useState(null);
  const [services, setServices] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [survey, setSurvey] = useState({
    preferredDate: "",
    preferredTime: visitTimes[0].value,
    durationHours: durationOptions[0],
  });

  useEffect(() => {
    const bookingSuccessMessage = sessionStorage.getItem("bookingSuccessMessage");

    if (bookingSuccessMessage) {
      toast.success(bookingSuccessMessage);
      sessionStorage.removeItem("bookingSuccessMessage");
    }
  }, []);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        setFeedback({ type: "", message: "" });

        const requests = [
          getServices(),
          getServiceResources(),
        ];

        if (localStorage.getItem("token")) {
          requests.push(getMyAccount());
        }

        const [serviceData, resourceData, accountData] = await Promise.all(requests);

        setServices(serviceData);
        setResources(resourceData);
        setAccount(accountData ?? null);
      } catch (error) {
        console.error("Error loading booking data:", error);
        setFeedback({
          type: "error",
          message: "Unable to load booking data from the backend.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  const servicesWithResources = useMemo(() => {
    const availableServiceIds = new Set(
      resources
        .filter((resource) => resource?.serviceId && resource.isAvailable !== false)
        .map((resource) => resource.serviceId)
    );

    return services.filter((service) => availableServiceIds.has(service.id));
  }, [services, resources]);

  useEffect(() => {
    if (!servicesWithResources.length) {
      setSelectedServiceId(null);
      return;
    }

    const hasSelectedService = servicesWithResources.some(
      (service) => service.id === selectedServiceId
    );

    if (!hasSelectedService) {
      setSelectedServiceId(servicesWithResources[0].id);
    }
  }, [servicesWithResources, selectedServiceId]);

  const selectedService = useMemo(
    () =>
      servicesWithResources.find((service) => service.id === selectedServiceId) ??
      servicesWithResources[0] ??
      null,
    [servicesWithResources, selectedServiceId]
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

  const bookingSlides = useMemo(
    () => buildVisualSlides(selectedService, availableResources, selectedResource),
    [selectedService, availableResources, selectedResource]
  );

  const activeSlide = bookingSlides[activeSlideIndex] ?? bookingSlides[0] ?? null;

  useEffect(() => {
    if (!bookingSlides.length) {
      setActiveSlideIndex(0);
      return;
    }

    setActiveSlideIndex((currentIndex) =>
      Math.min(currentIndex, bookingSlides.length - 1)
    );
  }, [bookingSlides]);

  useEffect(() => {
    if (!selectedResource?.id || !bookingSlides.length) return;

    const matchedSlideIndex = bookingSlides.findIndex(
      (slide) => slide.resourceId === selectedResource.id
    );

    if (matchedSlideIndex >= 0) {
      setActiveSlideIndex(matchedSlideIndex);
    }
  }, [selectedResource, bookingSlides]);

  useEffect(() => {
    if (bookingSlides.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % bookingSlides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [bookingSlides.length]);

  const handleSurveyChange = (event) => {
    const { name, value } = event.target;
    setSurvey((current) => ({ ...current, [name]: value }));
  };

  const canSubmit =
    role === "RESIDENT" &&
    !!account?.id &&
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

    if (!account?.id) {
      setFeedback({
        type: "error",
        message: "We could not verify your current account from the backend.",
      });
      return;
    }

    if (role !== "RESIDENT") {
      setFeedback({
        type: "error",
        message: "Only resident accounts can place service bookings.",
      });
      return;
    }

    if (!selectedResource) {
      setFeedback({
        type: "error",
        message: "This service currently has no available resource to book.",
      });
      return;
    }

    const startDateTime = new Date(
      toDateTimeString(survey.preferredDate, survey.preferredTime)
    );

    if (Number.isNaN(startDateTime.getTime())) {
      setFeedback({
        type: "error",
        message: "The selected booking time is invalid.",
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
        accountId: account.id,
        bookFrom: formatLocalDateTime(startDateTime),
        bookTo: formatLocalDateTime(endDateTime),
        status: 0,
        totalAmount: bookingAmount,
      });

      sessionStorage.setItem(
        "bookingSuccessMessage",
        "Your booking has been submitted successfully."
      );
      window.location.reload();
    } catch (error) {
      console.error("Error creating booking:", error);
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          "We could not submit your booking. Please try again.",
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
            <h1>Reserve premium resident services with confidence, speed, and seamless support.</h1>
            <p className="booking-hero-copy">
              Discover a curated collection of resident-exclusive amenities and premium lifestyle
              services. Select your preferred time, choose an available resource, and submit your
              request in just a few steps for a booking experience designed to feel effortless,
              refined, and professionally managed from start to finish.
            </p>
          </div>
        </section>

        <section className="booking-layout container">
          <div className="booking-survey-panel">
            <div className="booking-panel-header">
              <span className="booking-step">Step 1</span>
              <h2>Booking form</h2>
              <p>
                Choose an available service, select your preferred schedule, review the matching
                resource, and submit your booking request.
              </p>
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
              <div className="booking-empty-state">Loading services and resources...</div>
            ) : !servicesWithResources.length ? (
              <div className="booking-empty-state">
                There are currently no services with available resources for booking.
              </div>
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
                      value={account?.username || user?.username || "Chua dang nhap"}
                      readOnly
                    />
                  </label>
                </div>

                <div className="booking-service-picker">
                  <div className="booking-picker-header">
                    <span className="booking-step">Step 2</span>
                    <h3>Select your service</h3>
                    <p>Only services with live, bookable resources are shown here.</p>
                  </div>

                  <div className="booking-service-options">
                    {servicesWithResources.map((service) => (
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

                <div className="booking-summary-box">
                  <p className="booking-summary-label">Current selection</p>
                  <h3>{selectedService?.title || "No service selected"}</h3>
                  <p>{selectedService?.desc || "Select a service to view booking details."}</p>
                  <p>
                    Resource:{" "}
                    {selectedResource
                      ? `${selectedResource.resourceCode || `#${selectedResource.id}`} - ${
                          selectedResource.location || "No location"
                        }`
                      : "No resource selected"}
                  </p>
                  <p>
                    Estimated total:{" "}
                    {bookingAmount === null ? "Not available" : formatCurrency(bookingAmount)}
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
                    Please sign in with a resident account to submit a booking.
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <div className="booking-visual-panel">
            <div className="booking-visual-hero">
              {activeSlide?.image ? (
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title || selectedService?.title || "Booking service"}
                />
              ) : (
                <div className="booking-image-placeholder">No image</div>
              )}
              <div className="booking-visual-overlay">
                <p className="booking-step">Featured service</p>
                <h2>{activeSlide?.title || selectedService?.title || "Waiting for service data"}</h2>
                <p>{activeSlide?.description || selectedService?.tagline || "Live backend data will appear here."}</p>
              </div>

              {bookingSlides.length > 1 ? (
                <div className="booking-visual-dots">
                  {bookingSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      className={`booking-visual-dot ${
                        index === activeSlideIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveSlideIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="booking-areas">
              <div className="booking-picker-header">
                <span className="booking-step">Step 3</span>
                <h3>Available resources for this service</h3>
                <p>
                  Review the live backend resources currently mapped to your selected service
                  before completing the booking.
                </p>
              </div>

              <div className="booking-area-grid">
                {availableResources.length ? (
                  availableResources.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      className={`booking-area-card ${
                        resource.id === selectedResource?.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedResourceId(resource.id)}
                    >
                      <div className="booking-resource-visual">
                        {resource.imageUrl ? (
                          <img
                            src={resource.imageUrl}
                            alt={resource.resourceCode || `Resource #${resource.id}`}
                            className="booking-resource-image"
                          />
                        ) : null}
                        <span className="booking-resource-badge">
                          {resource.id === selectedResource?.id ? "Selected" : "Available"}
                        </span>
                        <h4>{resource.resourceCode || `Resource #${resource.id}`}</h4>
                      </div>
                      <div className="booking-area-content">
                        <h4>{resource.location || "Resource location will be updated soon"}</h4>
                        <p>
                          Backend resource ID: {resource.id}. This resource is currently available
                          for your selected service and can be reserved immediately.
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="booking-empty-state">
                    No live backend resources are available for this service right now.
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
