"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset submission status after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  const handleGetDirections = () => {
    // Open Google Maps with the store location
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=123+Baby+Avenue,Dhaka+1212,Bangladesh",
      "_blank"
    );
  };

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral-900 mb-4">
            Contact Us
          </h1>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto">
            Have questions about our products or need assistance with your
            order? Our friendly customer service team is here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
              <h2 className="text-xl font-bold text-brand-neutral-900 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-neutral-900">
                      Our Store
                    </h3>
                    <p className="text-brand-neutral-600">
                      123 Baby Avenue, Dhaka 1212
                      <br />
                      Bangladesh
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-neutral-900">
                      Phone
                    </h3>
                    <p className="text-brand-neutral-600">
                      <a
                        href="tel:+8801234567890"
                        className="hover:text-brand-primary-600 transition-colors"
                      >
                        +880 1234 567890
                      </a>{" "}
                      (Customer Service)
                      <br />
                      <a
                        href="tel:+8809876543210"
                        className="hover:text-brand-primary-600 transition-colors"
                      >
                        +880 9876 543210
                      </a>{" "}
                      (Order Support)
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-neutral-900">
                      Email
                    </h3>
                    <p className="text-brand-neutral-600">
                      <a
                        href="mailto:info@babyhaven.com"
                        className="hover:text-brand-primary-600 transition-colors"
                      >
                        info@babyhaven.com
                      </a>{" "}
                      (General inquiries)
                      <br />
                      <a
                        href="mailto:support@babyhaven.com"
                        className="hover:text-brand-primary-600 transition-colors"
                      >
                        support@babyhaven.com
                      </a>{" "}
                      (Customer support)
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-neutral-900">
                      Business Hours
                    </h3>
                    <p className="text-brand-neutral-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
              <h2 className="text-xl font-bold text-brand-neutral-900 mb-6">
                Connect With Us
              </h2>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-brand-neutral-900">
                Send Us a Message
              </h2>
            </div>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Thank you for your message! We'll get back to you within 24
                hours.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-brand-neutral-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-brand-neutral-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors"
                      placeholder="+880 1234 567890"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-primary-600 hover:bg-brand-primary-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Store Location Map */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6 text-center">
            Visit Our Store
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 overflow-hidden">
            {/* Google Maps Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14609.333664297143!2d90.40800755946101!3d23.735486951638972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85c366afdaf%3A0x63cbcd8b4dfb9d3c!2sMotijheel%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1753108007477!5m2!1sen!2sbd"
              width="100%"
              height="450"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Baby Haven Store Location"
            ></iframe>

            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-brand-neutral-900 mb-2">
                Baby Haven Store
              </h3>
              <p className="text-brand-neutral-600 mb-4">
                123 Baby Avenue, Dhaka 1212, Bangladesh
              </p>
              <Button
                onClick={handleGetDirections}
                variant="outline"
                className="border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-50 transition-colors"
              >
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
