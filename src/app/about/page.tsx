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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    {
      value: "10,000+",
      label: "Happy Families",
      icon: <Users className="h-6 w-6" />,
    },
    {
      value: "100%",
      label: "Safety Guarantee",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      value: "500+",
      label: "Quality Products",
      icon: <Award className="h-6 w-6" />,
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
      title: "Safety First",
      description:
        "Every product meets international safety standards for your little ones.",
    },
    {
      icon: <Leaf className="h-8 w-8 text-brand-primary-600" />,
      title: "Eco-Friendly",
      description:
        "We prioritize sustainable materials and ethical manufacturing.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-brand-primary-600" />,
      title: "Community Focused",
      description:
        "Supporting local artisans and mothers in need through our initiatives.",
    },
    {
      icon: <Truck className="h-8 w-8 text-brand-primary-600" />,
      title: "Hassle-Free Experience",
      description: "From browsing to delivery, we make parenting easier.",
    },
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
                Our Story
              </h1>
              <p className="text-lg text-white/90">
                From parents to parents - building a safer, happier world for
                babies
              </p>
            </div>
          </div>
          <Image
            src="https://images.pexels.com/photos/4545205/pexels-photo-4545205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Happy family with baby"
            fill
            className="object-cover"
            priority
          />
        </section>

        {/* Our Story Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-neutral-900 mb-4">
              Welcome to BabyHaven
            </h2>
            <div className="w-24 h-1 bg-brand-primary-600 mx-auto mb-6"></div>
            <p className="text-brand-neutral-600 mb-6">
              Founded in 2018 by parents who struggled to find quality baby
              products in Bangladesh, BabyHaven has grown into the nation's most
              trusted destination for baby essentials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-brand-neutral-900 mb-4">
                Our Journey
              </h3>
              <p className="text-brand-neutral-600 mb-4">
                It all began when our founders, Rahim and Ayesha, became parents
                for the first time. Frustrated by the lack of safe, affordable
                baby products available locally, they set out to create a better
                solution.
              </p>
              <p className="text-brand-neutral-600 mb-4">
                Starting from a small showroom in Dhaka, we've now served over
                10,000 families across Bangladesh with carefully curated
                products that meet international safety standards.
              </p>
              <p className="text-brand-neutral-600">
                Today, we're proud to be Bangladesh's fastest growing baby care
                brand, with plans to expand across South Asia while maintaining
                our commitment to quality and community.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.pexels.com/photos/25785858/pexels-photo-25785858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Happy parents with baby - BabyHaven founders"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-brand-primary-50 py-12 mb-16 rounded-xl">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-brand-neutral-900 text-center mb-12">
              Why Parents Trust Us
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
            Our Core Values
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

        {/* Team Section */}
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-brand-neutral-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rahim Khan",
                role: "Founder & CEO",
                bio: "Father of two, passionate about child safety and local manufacturing.",
                image:
                  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              },
              {
                name: "Ayesha Rahman",
                role: "Co-Founder & CMO",
                bio: "Mother and child development specialist with 10+ years experience.",
                image:
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              },
              {
                name: "Tahmina Akter",
                role: "Head of Product Safety",
                bio: "Ensures every product meets our rigorous safety standards.",
                image:
                  "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-64 w-full rounded-xl overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-brand-neutral-900">
                  {member.name}
                </h3>
                <p className="text-brand-primary-600 mb-2">{member.role}</p>
                <p className="text-brand-neutral-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-primary-600 rounded-xl p-12 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Growing Family
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Discover why thousands of Bangladeshi parents trust BabyHaven for
            their little ones' needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-brand-primary-600 hover:bg-brand-neutral-100">
              <Link href={"/shop"}>Shop Now</Link>
            </Button>
            <Button className=" bg-white text-brand-primary-600 hover:bg-brand-neutral-100">
              <Link href={"/contact"}>Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
