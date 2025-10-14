"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  HeartHandshake,
  Leaf,
  Shield,
  Truck,
  Award,
  Users,
  ShoppingBag,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    {
      value: "50,000+",
      label: "Happy Customers",
      icon: <Users className="h-6 w-6" />,
    },
    {
      value: "1,000+",
      label: "Quality Products",
      icon: <ShoppingBag className="h-6 w-6" />,
    },
    {
      value: "64",
      label: "Districts Served",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      value: "24/7",
      label: "Customer Support",
      icon: <HeartHandshake className="h-6 w-6" />,
    },
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-brand-primary-600" />,
      title: "Quality Guaranteed",
      description:
        "Every product is carefully selected and tested for quality assurance.",
    },
    {
      icon: <Truck className="h-8 w-8 text-brand-primary-600" />,
      title: "Fast Delivery",
      description:
        "Quick and reliable shipping across all 64 districts of Bangladesh.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-brand-primary-600" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority with 24/7 support.",
    },
    {
      icon: <Award className="h-8 w-8 text-brand-primary-600" />,
      title: "Best Prices",
      description: "Competitive pricing with regular discounts and offers.",
    },
  ];

  const categories = [
    "Skin care & cosmetics",
    "Health & beauty",
    "Baby foods & accessories",
    "Electronic gadgets",
    "Car/Bike/Bicycle parts",
    "Pet food & toys",
    "Musical & Sporting instruments",
    "Preorder",
  ];

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto mt-4 md:mt-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative h-96 rounded-xl overflow-hidden mb-16">
          <div className="absolute inset-0 bg-brand-primary-600/30 z-10 flex items-center justify-center">
            <div className="text-center max-w-2xl px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                About Britcartbd.com
              </h1>
              <p className="text-lg text-white/90">
                Your trusted online marketplace for everything you need
              </p>
            </div>
          </div>
          <Image
            src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Online shopping experience"
            fill
            className="object-cover"
            priority
          />
        </section>

        {/* Our Story Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-neutral-900 mb-4">
              Welcome to Britcartbd.com
            </h2>
            <div className="w-24 h-1 bg-brand-primary-600 mx-auto mb-6"></div>
            <p className="text-brand-neutral-600 mb-6">
              Founded with a vision to revolutionize online shopping in
              Bangladesh, Britcartbd.com has become one of the fastest-growing
              e-commerce platforms in the country.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-brand-neutral-900 mb-4">
                Our Journey
              </h3>
              <p className="text-brand-neutral-600 mb-4">
                Britcartbd.com started with a simple mission: to provide
                Bangladeshi consumers with access to a wide range of quality
                products at affordable prices, delivered right to their
                doorstep.
              </p>
              <p className="text-brand-neutral-600 mb-4">
                From our humble beginnings, we've grown to serve customers
                across all 64 districts of Bangladesh, offering everything from
                daily essentials to specialized products.
              </p>
              <p className="text-brand-neutral-600">
                Today, we're proud to be a trusted name in Bangladeshi
                e-commerce, continuously expanding our product range while
                maintaining our commitment to customer satisfaction and reliable
                service.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Britcartbd.com team and operations"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-brand-neutral-900 text-center mb-8">
            Our Product Categories
          </h2>
          <p className="text-brand-neutral-600 text-center mb-8 max-w-2xl mx-auto">
            We offer a diverse range of products to meet all your needs in one
            place
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-brand-neutral-200 text-center hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-6 w-6 text-brand-primary-600" />
                </div>
                <p className="text-sm font-medium text-brand-neutral-800">
                  {category}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-brand-primary-50 py-12 mb-16 rounded-xl">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-brand-neutral-900 text-center mb-12">
              Why Customers Choose Us
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary-600">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-neutral-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-brand-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-brand-neutral-900 text-center mb-12">
            Our Commitment to You
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-brand-neutral-200 text-center"
              >
                <div className="bg-brand-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-brand-neutral-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-brand-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping & Service */}
        <section className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-8 mb-16">
          <h2 className="text-3xl font-bold text-brand-neutral-900 text-center mb-8">
            Our Service Promise
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-brand-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-10 w-10 text-brand-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-brand-neutral-900 mb-3">
                Nationwide Delivery
              </h3>
              <ul className="text-brand-neutral-600 space-y-2 text-left">
                <li>• Inside Dhaka: ৳60-৳80 (1-2 days)</li>
                <li>• Outside Dhaka: ৳120-৳150 (2-4 days)</li>
                <li>• All 64 districts covered</li>
                <li>• Cash on Delivery available</li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-brand-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="h-10 w-10 text-brand-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-brand-neutral-900 mb-3">
                Customer Support
              </h3>
              <ul className="text-brand-neutral-600 space-y-2 text-left">
                <li>• 24/7 customer service</li>
                <li>• Easy returns & exchanges</li>
                <li>• Product quality guarantee</li>
                <li>• Secure payment options</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-primary-600 rounded-xl p-12 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Experience the Britcartbd.com Difference
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who trust us for their
            shopping needs. From skincare to electronics, baby products to
            automotive parts - we've got you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-white text-brand-primary-600 hover:bg-brand-neutral-100"
            >
              <Link href="/shop">Start Shopping</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-brand-primary-600 hover:bg-white hover:text-brand-primary-600"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>

        {/* Store Location */}
        <section className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
            Visit Our Store
          </h2>
          <p className="text-brand-neutral-600 mb-4">
            House No-12, Road No-11, Uttara-1, Dhaka 1230, Bangladesh
          </p>
          <p className="text-brand-neutral-600 mb-4">
            📞 +880 1684-986746 | ✉️ support@britcartbd.com
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">Get Directions</Link>
          </Button>
        </section>
      </main>

      <Footer />
    </>
  );
}
