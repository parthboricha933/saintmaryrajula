"use client";

import { SCHOOL } from "@/data/school-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Users,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const stats = [
  { icon: GraduationCap, label: "GSEB Affiliated", color: "text-gold" },
  { icon: BookOpen, label: `${SCHOOL.classes}`, color: "text-green-accent" },
  { icon: ShieldCheck, label: "Safe Campus", color: "text-blue-400" },
  { icon: Users, label: `Since ${SCHOOL.established}`, color: "text-gold-light" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-navy-dark"
    >
      {/* Background image + gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-school.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy/85 to-navy-dark/75" />

      {/* Decorative gradient orbs using Tailwind */}
      <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-20 left-[10%] w-56 h-56 rounded-full bg-green-accent/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 lg:pt-40 w-full">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* LEFT — Text Content (3 cols) */}
          <div className="lg:col-span-3 text-center lg:text-left">
            {/* Top badge row */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex justify-center lg:justify-start mb-8"
            >
              <Badge
                className="bg-white/10 border-white/20 text-gray-200 hover:bg-white/15 px-4 py-1.5 text-sm backdrop-blur-sm rounded-full gap-2 transition-colors"
              >
                <img
                  src="/school-logo.png"
                  alt="Logo"
                  className="w-4 h-4 rounded-full object-contain"
                />
                GSEB Affiliated | Since {SCHOOL.established}
              </Badge>
            </motion.div>

            {/* School name — serif display font */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-3"
            >
              {SCHOOL.name}
            </motion.h1>

            {/* Location — bold accent color */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gold mb-4"
            >
              {SCHOOL.location}
            </motion.p>

            {/* Tagline — italic serif */}
            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-xl text-gold-light/90 font-medium italic font-serif mb-6"
            >
              &ldquo;{SCHOOL.tagline}&rdquo;
            </motion.p>

            {/* Description */}
            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              A premier educational institution nurturing young minds from{" "}
              {SCHOOL.classes}. We blend traditional values with modern teaching
              to create confident, knowledgeable, and responsible citizens of
              tomorrow.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group text-base"
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Admission Open
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-all text-base"
                onClick={() =>
                  document
                    .querySelector("#about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore School
              </Button>
            </motion.div>
          </div>

          {/* RIGHT — Info Cards (2 cols) */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Main school identity card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Logo with gold ring */}
                  <div className="w-20 h-20 rounded-2xl bg-gold/15 border-2 border-gold/30 flex items-center justify-center mb-5 p-1.5">
                    <img
                      src="/school-logo.png"
                      alt="Saint Mary School Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif">
                    Saint Mary School
                  </h3>
                  <p className="text-gold-light text-sm font-medium mt-1">
                    Rajula, Gujarat
                  </p>
                </div>
                <Separator className="bg-white/15" />
                <div className="grid grid-cols-2 gap-0 divide-x divide-white/10">
                  {stats.slice(0, 2).map((stat) => (
                    <div
                      key={stat.label}
                      className="py-4 px-4 flex flex-col items-center gap-1.5"
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-gray-300 text-xs font-medium">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="bg-white/15" />
                <div className="grid grid-cols-2 gap-0 divide-x divide-white/10">
                  {stats.slice(2, 4).map((stat) => (
                    <div
                      key={stat.label}
                      className="py-4 px-4 flex flex-col items-center gap-1.5"
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-gray-300 text-xs font-medium">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Established year accent card */}
            <Card className="bg-gold/90 border-gold rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg font-serif">
                    Established {SCHOOL.established}
                  </p>
                  <p className="text-white/80 text-sm">
                    {SCHOOL.affiliationFull}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
