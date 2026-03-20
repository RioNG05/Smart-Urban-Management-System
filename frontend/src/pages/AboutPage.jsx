import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/about.css";
import {
    FaMapMarkerAlt,
    FaRoad,
    FaCity,
    FaTree,
    FaSwimmer,
    FaDumbbell,
    FaShoppingBag,
    FaChild,
    FaGraduationCap,
    FaCar,
    FaFireAlt,
    FaShieldAlt,
    FaUsers,
    FaLeaf,
    FaTableTennis,
    FaGolfBall,
    FaSpa,
} from "react-icons/fa";

export default function AboutPage() {
    return (
        <>
            <Navbar />

            {/* Hero Banner */}
            <div className="about-hero">
                <div className="hero-overlay">
                    <h2>Experience a Better Way of Living</h2>
                    <p>Comfortable homes, convenient services, and a vibrant neighborhood all in one place.</p>
                </div>
            </div>

            <div className="about-page-wrapper">
                {/* OVERVIEW */}
                <section className="about-overview">
                    <div className="container">
                        <span className="section-label">Project Overview</span>
                        <h2 className="section-title">Introduction to VINAHOUSE City</h2>
                        <div className="overview-content">
                            <div className="overview-text">
                                <p>
                                    <strong>VINAHOUSE City</strong> is the first international-scale smart mega urban area in Vietnam.
                                    The development is designed and built around four core pillars:
                                    Smart Security, Smart Operations, Smart Community, and Smart Homes (Smarthome).
                                </p>
                                <ul>
                                    <li><strong>Project Name:</strong> VINAHOUSE City</li>
                                    <li><strong>Location:</strong> Situated in the center of the largest satellite urban area in the western part of the city</li>
                                    <li><strong>Scale:</strong> Over 280hectares</li>
                                    <li><strong>Vision:</strong> To establish a new standard of living where advanced technology harmoniously integrates with nature.</li>
                                </ul>
                            </div>
                            <div className="overview-image">
                                <img
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                                    alt="Overview"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* LOCATION */}
                <section className="about-location bg-light">
                    <div className="container">
                        <span className="section-label">Location & Connectivity</span>
                        <h2 className="section-title">Golden Location – The Intersection of Prosperity</h2>
                        <div className="location-grid">
                            <div className="location-info">
                                <h3>A Prime Location in the Western Area</h3>
                                <p>Located in what is considered the “heart” of the new administrative center,
                                    the project offers convenient connections to major transportation routes:
                                </p>
                                <div className="loc-item">
                                    <FaMapMarkerAlt className="loc-icon" />
                                    <span>Only 10 minutes to the National Convention Center</span>
                                </div>
                                <div className="loc-item">
                                    <FaRoad className="loc-icon" />
                                    <span>Adjacent to the future Metro Lines 5, 6, and 7</span>
                                </div>
                                <div className="loc-item">
                                    <FaCity className="loc-icon" />
                                    <span>Situated at the intersection of two major boulevards:
                                        Thang Long Boulevard and Le Trong Tan Street
                                    </span>
                                </div>
                            </div>
                            <div className="location-map">
                                {/* Google Maps Embed */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14898.887854619375!2d105.740889!3d21.003781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345383f98cba47%3A0x7d6c6e7592cf3cb4!2sVinhomes%20Smart%20City%20T%C3%A2y%20M%E1%BB%97!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                                    className="map-img"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="VINAHOUSE Map Location"
                                    style={{ border: 0, height: "400px", borderRadius: "12px", width: "100%" }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROJECT SCALE */}
                <section className="about-scale">
                    <div className="container">
                        <span className="section-label">Massive Scale</span>
                        <h2 className="section-title text-center">A Grand Mega Urban Development</h2>
                        <div className="scale-stats">
                            <div className="scale-item">
                                <div className="scale-number">280ha</div>
                                <div className="scale-desc">Total Area</div>
                            </div>
                            <div className="scale-item">
                                <div className="scale-number">58</div>
                                <div className="scale-desc">Premium residential towers</div>
                            </div>
                            <div className="scale-item">
                                <div className="scale-number">40,000+</div>
                                <div className="scale-desc">Smart apartments</div>
                            </div>
                            <div className="scale-item">
                                <div className="scale-number">80,000</div>
                                <div className="scale-desc">Expected residents</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AMENITIES */}
                <section className="about-amenities bg-light">
                    <div className="container">
                        <span className="section-label">Exclusive Amenities</span>
                        <h2 className="section-title text-center">A Complete Lifestyle Ecosystem</h2>
                        <p className="amenities-desc text-center">
                            Every need for living, learning, working, and entertainment
                            is fully met within just a few steps.
                        </p>
                        <div className="amenities-grid">
                            <div className="amenity-card">
                                <FaTree className="icon" />
                                <h4>Green Park</h4>
                                <p>A 10.2-hectare central park, one of the largest of its kind in Southeast Asia.</p>
                            </div>
                            <div className="amenity-card">
                                <FaSwimmer className="icon" />
                                <h4>Resort-Style Swimming Pools</h4>
                                <p>An extensive system of infinity pools and Olympic-standard swimming pools.</p>
                            </div>
                            <div className="amenity-card">
                                <FaDumbbell className="icon" />
                                <h4>Gym & Yoga Facilities</h4>
                                <p>Over 1,000 outdoor fitness machines along with 5-star standard indoor gym facilities.</p>
                            </div>
                            <div className="amenity-card">
                                <FaShoppingBag className="icon" />
                                <h4>Shopping Center</h4>
                                <p>A vibrant Mega Mall shopping destination located within the community.</p>
                            </div>
                            <div className="amenity-card">
                                <FaChild className="icon" />
                                <h4>Children’s Playground</h4>
                                <p>More than 60 interconnected playgrounds distributed throughout the development.</p>
                            </div>
                            <div className="amenity-card">
                                <FaGraduationCap className="icon" />
                                <h4>Education System</h4>
                                <p>An international inter-level school system from kindergarten to high school.</p>
                            </div>
                            <div className="amenity-card">
                                <FaCar className="icon" />
                                <h4>Smart Parking</h4>
                                <p>Automatic license plate recognition and parking space detection via mobile app.</p>
                            </div>
                            <div className="amenity-card">
                                <FaFireAlt className="icon" />
                                <h4>BBQ Park</h4>
                                <p>Over 100 outdoor BBQ stations set beside a scenic white sand lake for gatherings and leisure.</p>
                            </div>
                            <div className="amenity-card">
                                <FaTableTennis className="icon" />
                                <h4>Tennis Court</h4>
                                <p>Professional-grade tennis courts with high-quality surfaces and night lighting.</p>
                            </div>
                            <div className="amenity-card">
                                <FaGolfBall className="icon" />
                                <h4>Golf Course</h4>
                                <p>Premium mini-golf courses and putting greens for practice and leisure.</p>
                            </div>
                            <div className="amenity-card">
                                <FaSpa className="icon" />
                                <h4>Sauna & Spa</h4>
                                <p>Luxury sauna and spa facilities offering a range of wellness treatments.</p>
                            </div>
                            <div className="amenity-card">
                                <FaUsers className="icon" />
                                <h4>Community Hall</h4>
                                <p>Spacious and versatile community halls for meetings and social gatherings.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* LIVING ENVIRONMENT */}
                <section className="about-environment">
                    <div className="container">
                        <div className="env-grid">
                            <div className="env-image">
                                <img
                                    src="https://media.tietkiemnangluong.com.vn/Images/Upload/User/quantri/2024/6/vinhome2.jpg"
                                    alt="Living Environment"
                                />
                            </div>
                            <div className="env-content">
                                <span className="section-label">Live Life to the Fullest</span>
                                <h2 className="section-title">An Ideal Living Environment</h2>

                                <div className="env-feature">
                                    <div className="icon-box"><FaLeaf /></div>
                                    <div className="text-box">
                                        <h4>Green Ecological Living Space</h4>
                                        <p>With a construction density of only 14.7%,
                                            the majority of the area is dedicated to water features and green landscapes,
                                            creating a fresh and sustainable environment.
                                        </p>
                                    </div>
                                </div>

                                <div className="env-feature">
                                    <div className="icon-box"><FaUsers /></div>
                                    <div className="text-box">
                                        <h4>A Refined and Vibrant Community</h4>
                                        <p>A multinational living environment that brings together
                                            intellectuals, professionals, and international experts.
                                        </p>
                                    </div>
                                </div>

                                <div className="env-feature">
                                    <div className="icon-box"><FaShieldAlt /></div>
                                    <div className="text-box">
                                        <h4>24/7 Security System</h4>
                                        <p>A multi-layer security system with AI-powered facial recognition cameras,
                                            ensuring maximum safety for all residents.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
