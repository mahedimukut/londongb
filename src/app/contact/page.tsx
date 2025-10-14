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

    // Prepare email content
    const emailBody = `
    Name: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Subject: ${formData.subject}

    Message:
    ${formData.message}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:britcartbd@gmail.com?subject=Contact Form: ${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(emailBody)}`;

    // Simulate form submission
    setTimeout(() => {
      // Open user's email client
      window.location.href = mailtoLink;

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset submission status after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

  const handleGetDirections = () => {
    // Open Google Maps with the store location
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=House+No-12,Road+No-11,Uttara-1,Dhaka+1230,Bangladesh",
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
                      House No-12, Road No-11, Uttara-1
                      <br />
                      Dhaka 1230, Bangladesh
                    </p>
                    <button
                      onClick={handleGetDirections}
                      className="text-brand-primary-600 hover:text-brand-primary-700 text-sm font-medium mt-1 transition-colors"
                    >
                      Get Directions →
                    </button>
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
                        href="tel:+8801684986746"
                        className="hover:text-brand-primary-600 transition-colors"
                      >
                        +880 1684-986746
                      </a>{" "}
                      (Customer Service)
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
                        href="mailto:support@britcartbd.com"
                        className="hover:text-brand-primary-600 transition-colors"
                      >
                        support@britcartbd.com
                      </a>{" "}
                      (Customer support)
                      <br />
                      <a
                        href="mailto:info@britcartbd.com"
                        className="hover:text-brand-primary-600 transition-colors"
                      >
                        info@britcartbd.com
                      </a>{" "}
                      (General inquiries)
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
                      Saturday - Thursday: 9:00 AM - 10:00 PM
                      <br />
                      Friday: 3:00 PM - 10:00 PM
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
                    href="https://facebook.com/britcartbd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href="https://instagram.com/britcartbd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href="https://twitter.com/britcartbd"
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
                <div>
                  <p className="font-medium">Message ready to send!</p>
                  <p className="text-sm mt-1">
                    Your email client should open automatically. If not, please
                    send your message to{" "}
                    <a href="mailto:britcartbd@gmail.com" className="underline">
                      britcartbd@gmail.com
                    </a>
                  </p>
                </div>
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
                      Preparing your message...
                    </>
                  ) : (
                    "Open Email to Send Message"
                  )}
                </Button>

                <p className="text-xs text-brand-neutral-500 text-center">
                  This will open your email client with your message pre-filled.
                  You just need to click "Send".
                </p>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.123456789012!2d90.40840737576953!3d23.8700461785892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c7a6a1a1b%3A0x1234567890abcdef!2sHouse%20No-12%2C%20Road%20No-11%2C%20Uttara-1%2C%20Dhaka%201230%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
              width="100%"
              height="450"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Britcartbd.com Store Location - House No-12, Road No-11, Uttara-1, Dhaka 1230, Bangladesh"
            ></iframe>

            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-brand-neutral-900 mb-2">
                Britcartbd.com Store
              </h3>
              <p className="text-brand-neutral-600 mb-4">
                House No-12, Road No-11, Uttara-1, Dhaka 1230, Bangladesh
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
