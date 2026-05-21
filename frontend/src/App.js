import { useEffect, useRef, useState } from "react";
import "@/App.css";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Referral from "./Referral";
import DisciplinePage from "./DisciplinePage";
import { Navigation, Footer } from "./shared";
import {
  ArrowUpRight,
  ArrowRight,
  Quote,
  Plus,
} from "lucide-react";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1769236883905-f146c6dd7a9e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxyYWNpbmclMjBiaWN5Y2xlJTIwbW90aW9ufGVufDB8fHx8MTc3ODA5Nzk3MXww&ixlib=rb-4.1.0&q=85",
  run: "https://images.unsplash.com/photo-1765914448187-ee93dd13e1e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lciUyMHJhY2V8ZW58MHx8fHwxNzc4MDk3OTcxfDA&ixlib=rb-4.1.0&q=85",
  tri: "https://images.unsplash.com/photo-1663945618146-11bd7004f8d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwyfHxvcGVuJTIwd2F0ZXIlMjBzd2ltbWVyJTIwcmFjZXxlbnwwfHx8fDE3NzgwOTc5ODR8MA&ixlib=rb-4.1.0&q=85",
  cycling:
    "https://images.unsplash.com/photo-1760001868208-be45d747a46c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBiaWN5Y2xlJTIwbW90aW9ufGVufDB8fHx8MTc3ODA5Nzk3MXww&ixlib=rb-4.1.0&q=85",
  kona: "https://images.unsplash.com/photo-1617332763121-0106f3dd4935?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxoYXdhaWklMjBjb2FzdCUyMGtvbmF8ZW58MHx8fHwxNzc4MDk3OTU2fDA&ixlib=rb-4.1.0&q=85",
  nice: "https://images.pexels.com/photos/16584904/pexels-photo-16584904.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  taupo: "https://images.unsplash.com/photo-1602593978328-fa9efcf69947?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHx0YXVwb3wlMjBuZXclMjBlYWxhbmR8ZW58MHx8fHwxNzQ4MjY1ODk3fDA&ixlib=rb-4.1.0&q=85",
  cairns: "https://images.unsplash.com/photo-1552252793-5e302d8f5daf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxjYWlybnMlMjBncmVhdCUyMmJhcmllcmVyJTIwdmFsdCB8ZW58MHx8fHwxNzQ4MjY1ODk3fDA&ixlib=rb-4.1.0&q=85",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec18b86502?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBob2JieSUyMHJhY2V8ZW58MHx8fHwxNzQ4MjY1ODk3fDA&ixlib=rb-4.1.0&q=85",
  queenstown: "https://images.unsplash.com/photo-1506973233135-2c4dee16ddb2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxxdWVlbnN0b3duJTIwbmV3JTIwZWFsYW5kJTIwc2tpJTIwbW91bnRhaW58ZW58MHx8fHwxNzQ4MjY1ODk3fDA&ixlib=rb-4.1.0&q=85",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ---------------------------- Hero ---------------------------- */

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Top meta row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center justify-between mb-10 md:mb-16"
        >
          <div className="flex items-center gap-3">
            <span className="dot" />
            <span className="eyebrow">A Division of Outdoor Travel Adventures</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-[#595959] font-semibold">
            <Link to="/discipline/marathon" className="text-inherit hover:text-[#2C3E35] transition-colors">Marathon</Link>
            <span className="text-[#E5E3DB]">/</span>
            <Link to="/discipline/ultra-marathon" className="text-inherit hover:text-[#2C3E35] transition-colors">Ultra-Marathon</Link>
            <span className="text-[#E5E3DB]">/</span>
            <Link to="/discipline/triathlon" className="text-inherit hover:text-[#2C3E35] transition-colors">Triathlon</Link>
            <span className="text-[#E5E3DB]">/</span>
            <Link to="/discipline/cycling" className="text-inherit hover:text-[#2C3E35] transition-colors">Cycling</Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          {/* Headline */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="col-span-12 lg:col-span-7"
          >
            <h1 className="font-serif-display text-[56px] leading-[1.02] md:text-[104px] md:leading-[0.98] text-[#111111] tracking-tight">
              Race travel,
              <br />
              <span className="italic text-[#2C3E35]">curated</span> around
              <br />
              the athlete.
            </h1>
          </motion.div>

          {/* Side copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="col-span-12 lg:col-span-4 lg:col-start-9"
          >
            <div className="rule mb-6" />
            <p className="font-sans-body text-[15px] md:text-[16px] leading-[1.7] text-[#595959] max-w-md">
              We design life-enhancing journeys that let you focus on training and
              performance — while we handle the logistics, elevate recovery, and
              choreograph the celebration.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#start"
                data-testid="hero-cta-primary"
                className="btn-primary px-7 py-4 text-[12px] tracking-[0.22em] uppercase font-semibold inline-flex items-center gap-3"
              >
                Begin a Journey <ArrowUpRight size={14} />
              </a>
              <a
                href="#destinations"
                data-testid="hero-cta-secondary"
                className="link-underline text-[12px] tracking-[0.22em] uppercase font-semibold text-[#111111] inline-flex items-center gap-2 py-4"
              >
                Explore Destinations <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Asymmetric image + specimen */}
        <div className="mt-16 md:mt-24 grid grid-cols-12 gap-4 md:gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-8 relative overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <motion.img
              src={IMAGES.hero}
              alt="Cyclist in motion"
              className="hero-img absolute inset-0 w-full h-full object-cover"
              style={{ y }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
              <div className="eyebrow text-white/80 mb-2">Chapter 01</div>
              <div className="font-serif-display text-2xl md:text-3xl">Kona · Ironman World Championship</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-4 bg-[#2C3E35] text-[#F7F5F0] p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="eyebrow text-[#F7F5F0]/70">A Promise</div>
              <p className="font-serif-display italic text-2xl md:text-[28px] leading-[1.25] mt-5 text-[#F7F5F0]">
                "Race week is not the time for travel surprises."
              </p>
            </div>
            <div className="mt-10">
              <div className="rule bg-[#F7F5F0]/20 mb-5" />
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-serif-display text-5xl md:text-6xl text-[#F7F5F0]">29</div>
                  <div className="eyebrow text-[#F7F5F0]/70 mt-1">Years Planning</div>
                </div>
                <div className="text-right">
                  <div className="font-serif-display text-5xl md:text-6xl text-[#F7F5F0]">46</div>
                  <div className="eyebrow text-[#F7F5F0]/70 mt-1">Countries</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------- Marquee ---------------------------- */
const Marquee = () => {
  const items = [
    "Boston Marathon",
    "Ironman Kona",
    "Berlin Marathon",
    "Ironman Nice",
    "Paris-Roubaix",
    "NYC Marathon",
    "London Marathon",
    "Giro d'Italia",
    "Chicago Marathon",
    "Ironman 70.3 Worlds",
    "Tokyo Marathon",
    "Leadville 100",
  ];
  return (
    <section
      data-testid="marquee-section"
      className="border-y border-[#E5E3DB] bg-[#F7F5F0] overflow-hidden"
    >
      <div className="py-6 flex whitespace-nowrap marquee-track">
        {[...items, ...items].map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-8 font-serif-display text-2xl md:text-3xl text-[#111111]"
          >
            <span>{it}</span>
            <span className="w-1.5 h-1.5 bg-[#2C3E35] rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------------------------- Philosophy / Anti-discount ---------------------------- */
const Philosophy = () => {
  return (
    <section
      id="philosophy"
      data-testid="philosophy-section"
      className="py-24 md:py-40 bg-[#F7F5F0]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 lg:col-span-3">
            <div className="eyebrow mb-4">On Our Craft</div>
            <div className="font-serif-display text-[#2C3E35] italic text-lg">
              A statement of intent.
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-display text-[40px] md:text-[68px] leading-[1.05] text-[#111111] tracking-tight"
            >
              This is not a discount travel site.{" "}
              <span className="text-[#595959]">
                We do not sell packages, race-day bundles, or stock itineraries.
              </span>{" "}
              <span className="italic text-[#2C3E35]">
                We compose bespoke race journeys — by hand, one athlete at a time.
              </span>
            </motion.h2>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 border-t border-[#E5E3DB]">
              {[
                {
                  k: "01",
                  t: "Curated, not catalogued",
                  d: "No drop-down destinations. Every itinerary begins with a conversation about your season, your goals, and your taper.",
                },
                {
                  k: "02",
                  t: "Training-first logistics",
                  d: "Flights, hotels, transfers, and bike transport aligned to your block — so race morning is the only variable.",
                },
                {
                  k: "03",
                  t: "Concierge from arrival to recovery",
                  d: "Course recon, nutrition sourcing, massage, and a celebration worth the miles you put in.",
                },
              ].map((p, i) => (
                <motion.div
                  key={p.k}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-8 pb-2 md:border-l md:border-[#E5E3DB] md:pl-8 md:first:border-l-0 md:first:pl-0"
                >
                  <div className="font-serif-display text-4xl text-[#2C3E35]">{p.k}</div>
                  <div className="font-serif-display text-2xl text-[#111111] mt-4 leading-snug">
                    {p.t}
                  </div>
                  <p className="mt-3 text-[14px] text-[#595959] leading-[1.7] max-w-sm">
                    {p.d}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------- Services ---------------------------- */
const services = [
  {
    id: "run",
    tag: "Chapter I",
    title: "Run Travel",
    sub: "Marathon & Half-Marathon",
    body:
      "From course proximity to recovery amenities — we plan around the six Majors, destination marathons, and the races you've been circling on the calendar.",
    highlights: ["World Marathon Majors", "Destination Marathons", "Half-Marathon Escapes"],
    img: IMAGES.run,
  },
  {
    id: "triathlon",
    tag: "Chapter II",
    title: "Triathlon Travel",
    sub: "Ironman & 70.3",
    body:
      "Bike transport, course recon, swim scouting, and training-first scheduling so that transition-area logistics never steal focus from your race.",
    highlights: ["Ironman Full Distance", "Ironman 70.3", "World Championships"],
    img: IMAGES.tri,
  },
  {
    id: "cycling",
    tag: "Chapter III",
    title: "Cycling & Bike Travel",
    sub: "Gran Fondos & Tours",
    body:
      "Bike-friendly hotels, secure storage, guided route access, and support vehicles — whether you're chasing a Gran Fondo or riding a Grand Tour stage.",
    highlights: ["Gran Fondos", "Cycling Tours", "Race-Week Logistics"],
    img: IMAGES.cycling,
  },
];

const Services = () => {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="py-24 md:py-32 bg-[#FFFFFF] border-y border-[#E5E3DB]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="eyebrow mb-4">The Disciplines</div>
            <h2 className="font-serif-display text-[40px] md:text-[64px] leading-[1.05] text-[#111111] tracking-tight max-w-2xl">
              Three disciplines.
              <br />
              <span className="italic text-[#2C3E35]">One standard of care.</span>
            </h2>
          </div>
          <div className="hidden md:block max-w-xs text-[14px] text-[#595959] leading-[1.7]">
            Every engagement is designed around a single calendar — yours — and every
            choice we make serves the race you've trained to run.
          </div>
        </div>

        <div className="space-y-0">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`grid grid-cols-12 gap-6 md:gap-10 py-12 md:py-20 border-t border-[#E5E3DB] ${
                i === services.length - 1 ? "border-b" : ""
              }`}
            >
              <div
                className={`col-span-12 lg:col-span-6 ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/3" }}
                >
                  <img
                    src={s.img}
                    alt={s.title}
                    className="hero-img absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div
                className={`col-span-12 lg:col-span-5 lg:col-start-${
                  i % 2 === 1 ? "1" : "8"
                } flex flex-col justify-center`}
              >
                <div className="eyebrow text-[#2C3E35] mb-4">{s.tag}</div>
                <h3 className="font-serif-display text-[40px] md:text-[56px] leading-[1.02] text-[#111111] tracking-tight">
                  {s.title}
                </h3>
                <div className="font-serif-display italic text-xl md:text-2xl text-[#2C3E35] mt-2">
                  {s.sub}
                </div>
                <p className="mt-6 text-[15px] md:text-[16px] text-[#595959] leading-[1.75] max-w-lg">
                  {s.body}
                </p>
                <ul className="mt-8 space-y-3">
                  {s.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-3 text-[13px] tracking-wide text-[#111111]"
                    >
                      <span className="w-6 h-px bg-[#2C3E35]" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <a
                    href="#start"
                    data-testid={`service-${s.id}-cta`}
                    className="link-underline text-[12px] tracking-[0.22em] uppercase font-semibold text-[#111111] inline-flex items-center gap-2"
                  >
                    Begin {s.title} Planning <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------- Destinations ---------------------------- */
const destinations = [
  { code: "B", city: "Boston", race: "Boston Marathon", country: "USA", month: "April" },
  { code: "K", city: "Kona", race: "Ironman World Championship", country: "Hawaii", month: "October" },
  { code: "N", city: "Nice", race: "Ironman France", country: "France", month: "June" },
  { code: "T", city: "Taupo", race: "Ironman New Zealand", country: "New Zealand", month: "March" },
  { code: "C", city: "Cairns", race: "Ironman Cairns", country: "Australia", month: "July" },
  { code: "S", city: "Sydney", race: "TCS Sydney Marathon", country: "Australia", month: "August" },
  { code: "Q", city: "Queenstown", race: "NZ Queenstown Marathon", country: "New Zealand", month: "September" },
  { code: "B", city: "Berlin", race: "Berlin Marathon", country: "Germany", month: "September" },
  { code: "S", city: "St. George", race: "Ironman 70.3 Worlds", country: "USA", month: "September" },
  { code: "N", city: "New York", race: "NYC Marathon", country: "USA", month: "November" },
];

const Destinations = () => {
  return (
    <section
      id="destinations"
      data-testid="destinations-section"
      className="py-24 md:py-32 bg-[#F7F5F0]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div className="eyebrow mb-4">A Short List</div>
            <h2 className="font-serif-display text-[40px] md:text-[68px] leading-[1.04] text-[#111111] tracking-tight">
              Featured race <span className="italic text-[#2C3E35]">destinations.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-[14px] text-[#595959] leading-[1.7]">
              Iconic races where we help athletes travel, recover, and perform.
              Beyond these, we plan for any start line on the calendar.
            </p>
          </div>
        </div>

       {/* Featured grid — hero row */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <motion.a
            href="#start"
            data-testid="destination-kona"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-6 relative overflow-hidden group"
            style={{ minHeight: 480 }}
          >
            <img
              src={IMAGES.kona}
              alt="Kona"
              className="hero-img absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute top-6 left-6 md:top-8 md:left-8 text-white/90">
              <div className="eyebrow text-white/70">Featured · October</div>
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white max-w-md">
              <div className="font-serif-display text-5xl md:text-7xl leading-none">Kona</div>
              <div className="font-serif-display italic text-lg md:text-2xl mt-2 text-white/90">
                Ironman World Championship
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase font-semibold">
                Plan a Kona Journey <ArrowUpRight size={14} />
              </div>
            </div>
          </motion.a>

          <div className="col-span-12 md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Nice */}
            <motion.a
              href="#start"
              data-testid="destination-nice"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ minHeight: 230 }}
            >
              <img
                src={IMAGES.nice}
                alt="Nice"
                className="hero-img absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/90">
                <div className="eyebrow text-white/70 text-[10px]">Featured · June</div>
              </div>
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                <div className="font-serif-display text-3xl md:text-5xl leading-none">Nice</div>
                <div className="font-serif-display italic text-sm md:text-lg mt-1 text-white/90">
                  Ironman France · Côte d'Azur
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-semibold">
                  Plan a Nice Journey <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.a>

            {/* Taupo */}
            <motion.a
              href="#start"
              data-testid="destination-taupo"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ minHeight: 230 }}
            >
              <img
                src={IMAGES.taupo}
                alt="Taupo"
                className="hero-img absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 md:top-6 md:left-8 text-white/90">
                <div className="eyebrow text-white/70 text-[10px]">Featured · March</div>
              </div>
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                <div className="font-serif-display text-3xl md:text-5xl leading-none">Taupo</div>
                <div className="font-serif-display italic text-sm md:text-lg mt-1 text-white/90">
                  Ironman New Zealand
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-semibold">
                  Plan a Taupo Journey <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.a>

            {/* Cairns */}
            <motion.a
              href="#start"
              data-testid="destination-cairns"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ minHeight: 230 }}
            >
              <img
                src={IMAGES.cairns}
                alt="Cairns"
                className="hero-img absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/90">
                <div className="eyebrow text-white/70 text-[10px]">Featured · July</div>
              </div>
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                <div className="font-serif-display text-3xl md:text-5xl leading-none">Cairns</div>
                <div className="font-serif-display italic text-sm md:text-lg mt-1 text-white/90">
                  Ironman Cairns
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-semibold">
                  Plan a Cairns Journey <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.a>

            {/* Sydney */}
            <motion.a
              href="#start"
              data-testid="destination-sydney"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ minHeight: 230 }}
            >
              <img
                src={IMAGES.sydney}
                alt="Sydney"
                className="hero-img absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 md:top-6 md:left-8 text-white/90">
                <div className="eyebrow text-white/70 text-[10px]">Featured · August</div>
              </div>
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                <div className="font-serif-display text-3xl md:text-5xl leading-none">Sydney</div>
                <div className="font-serif-display italic text-sm md:text-lg mt-1 text-white/90">
                  TCS Sydney Marathon
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-semibold">
                  Plan a Sydney Journey <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.a>

            {/* Queenstown */}
            <motion.a
              href="#start"
              data-testid="destination-queenstown"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 relative overflow-hidden"
              style={{ minHeight: 230 }}
            >
              <img
                src={IMAGES.queenstown}
                alt="Queenstown"
                className="hero-img absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 md:top-6 md:left-8 text-white/90">
                <div className="eyebrow text-white/70 text-[10px]">Featured · September</div>
              </div>
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                <div className="font-serif-display text-3xl md:text-5xl leading-none">Queenstown</div>
                <div className="font-serif-display italic text-sm md:text-lg mt-1 text-white/90">
                  NZ Queenstown Marathon
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.22em] uppercase font-semibold">
                  Plan a Queenstown Journey <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.a>
          </div>
        </div>

        {/* List of other destinations */}
        <div className="mt-16 border-t border-[#E5E3DB]">
          {destinations.slice(0, 10).map((d, i) => (
            <motion.a
              key={d.city + i}
              href="#start"
              data-testid={`destination-row-${d.city.toLowerCase().replace(/\s/g, "-")}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
              className="group grid grid-cols-12 gap-4 py-6 md:py-8 border-b border-[#E5E3DB] items-center hover:bg-white transition-colors duration-500"
            >
              <div className="col-span-1 font-serif-display text-xl md:text-2xl text-[#2C3E35]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-5 md:col-span-4 font-serif-display text-2xl md:text-4xl text-[#111111] tracking-tight">
                {d.city}
              </div>
              <div className="col-span-4 md:col-span-4 text-[13px] md:text-[15px] text-[#595959] italic font-serif-display">
                {d.race}
              </div>
              <div className="hidden md:block col-span-2 text-[12px] tracking-[0.2em] uppercase text-[#595959] font-semibold">
                {d.month}
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <Plus
                  size={20}
                  className="text-[#111111] transition-transform duration-500 group-hover:rotate-90 group-hover:text-[#2C3E35]"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------- Why ESTravel ---------------------------- */
const Why = () => {
  const stats = [
    { n: "1996", l: "Founded by Endurance Athletes" },
    { n: "3,400+", l: "Athletes Planned" },
    { n: "46", l: "Countries Raced" },
    { n: "100%", l: "Bespoke · Never Packaged" },
  ];
  return (
    <section
      id="why"
      data-testid="why-section"
      className="py-24 md:py-32 bg-[#2C3E35] text-[#F7F5F0] relative overflow-hidden grain"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 lg:col-span-4">
            <div className="eyebrow text-[#F7F5F0]/60">Why Endurance Sport Travel</div>
            <div className="mt-4 font-serif-display italic text-xl text-[#F7F5F0]/80">
              Founded by athletes. Built for them.
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="font-serif-display text-[36px] md:text-[56px] leading-[1.08] text-[#F7F5F0] tracking-tight">
              We know endurance events because{" "}
              <span className="italic text-[#B08D57]">endurance athletes</span> founded
              us. Every itinerary is built around your training, taper, race, and
              recovery — because race week is not the time for travel surprises.
            </h2>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-[#F7F5F0]/15 pt-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="md:border-l md:border-[#F7F5F0]/15 md:pl-6 md:first:border-l-0 md:first:pl-0"
            >
              <div className="font-serif-display text-5xl md:text-6xl text-[#F7F5F0] leading-none">
                {s.n}
              </div>
              <div className="mt-4 eyebrow text-[#F7F5F0]/60 max-w-[180px]">
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------- Testimonials ---------------------------- */
const testimonials = [
  {
    quote:
      "They understood the taper before I mentioned it. Everything — flights, hotel, bike — was aligned to the race, not the other way around.",
    name: "Dr. Helena Marsh",
    detail: "Ironman Kona · Age Group Podium",
  },
  {
    quote:
      "I've used agencies. This is not an agency. It's a small team that treats your race like their own.",
    name: "Andrés Beltrán",
    detail: "Berlin Marathon · Sub-3:00",
  },
  {
    quote:
      "From bike transport in Nice to the oat milk at breakfast — nothing was an afterthought.",
    name: "Miriam Iwata",
    detail: "Ironman France",
  },
];

const Testimonials = () => {
  return (
    <section
      data-testid="testimonials-section"
      className="py-24 md:py-32 bg-[#F7F5F0]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="eyebrow mb-4">On The Record</div>
            <h2 className="font-serif-display text-[40px] md:text-[64px] leading-[1.05] text-[#111111] tracking-tight">
              From the athletes
              <br />
              <span className="italic text-[#2C3E35]">we've served.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[#E5E3DB]">
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="p-8 md:p-10 md:border-l md:border-[#E5E3DB] md:first:border-l-0 border-b md:border-b-0"
            >
              <Quote size={24} className="text-[#2C3E35]" />
              <blockquote className="mt-6 font-serif-display text-[22px] md:text-[26px] leading-[1.35] text-[#111111] italic">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-[#E5E3DB]">
                <div className="font-serif-display text-lg text-[#111111]">{t.name}</div>
                <div className="eyebrow text-[#595959] mt-1">{t.detail}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------- CTA / Start Planning ---------------------------- */
const StartPlanning = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [race, setRace] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, race, newsletter }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Something went wrong. Please try again or email us directly.");
      }
    } catch (err) {
      console.error("Form submission failed", err);
      setError("Could not reach our server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section
      id="start"
      data-testid="start-planning-section"
      className="py-24 md:py-40 bg-[#111111] text-[#F7F5F0] relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 lg:col-span-7">
            <div className="eyebrow text-[#F7F5F0]/60 mb-6">
              Begin the Conversation
            </div>
            <h2 className="font-serif-display text-[44px] md:text-[84px] leading-[0.98] text-[#F7F5F0] tracking-tight">
              Tell us about your{" "}
              <span className="italic text-[#B08D57]">next start line.</span>
            </h2>
            <p className="mt-8 font-sans-body text-[15px] md:text-[17px] text-[#F7F5F0]/70 max-w-xl leading-[1.7]">
              A race on the calendar. A season in mind. A multi-day cycling tour
              across the hills of Tuscany. A one-line note is enough — our team will
              reach out within one business day to design a journey built entirely
              around you.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="bg-[#F7F5F0] text-[#111111] p-8 md:p-10">
              {submitted ? (
                <div data-testid="start-planning-success">
                  <div className="eyebrow text-[#2C3E35] mb-4">Received</div>
                  <div className="font-serif-display text-3xl text-[#111111]">
                    Thank you. A member of our team will be in touch within one
                    business day.
                  </div>
                </div>
              ) : error ? (
                <div data-testid="start-planning-error">
                  <div className="eyebrow text-[#B05757] mb-4">Error</div>
                  <div className="font-serif-display text-2xl text-[#111111] mb-6">
                    {error}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setError(""); setEmail(""); setName(""); setRace(""); setNewsletter(true); }}
                    className="btn-primary px-8 py-5 text-[12px] tracking-[0.24em] uppercase font-semibold w-full justify-center"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handle} className="space-y-6">
                  <div>
                    <label className="eyebrow text-[#595959]">Name</label>
                    <input
                      data-testid="form-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full border-b border-[#E5E3DB] bg-transparent py-3 font-serif-display text-2xl text-[#111111] focus:outline-none focus:border-[#2C3E35] transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="eyebrow text-[#595959]">Email</label>
                    <input
                      data-testid="form-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-2 w-full border-b border-[#E5E3DB] bg-transparent py-3 font-serif-display text-2xl text-[#111111] focus:outline-none focus:border-[#2C3E35] transition-colors"
                      placeholder="you@domain.com"
                    />
                  </div>
                  <div>
                    <label className="eyebrow text-[#595959]">
                      The Event You Have in Mind
                    </label>
                    <input
                      data-testid="form-event"
                      type="text"
                      value={race}
                      onChange={(e) => setRace(e.target.value)}
                      className="mt-2 w-full border-b border-[#E5E3DB] bg-transparent py-3 font-serif-display text-2xl text-[#111111] focus:outline-none focus:border-[#2C3E35] transition-colors"
                      placeholder="e.g. Boston Marathon, April"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      data-testid="form-newsletter"
                      type="checkbox"
                      id="newsletter"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#E5E3DB] text-[#2C3E35] focus:ring-[#2C3E35] focus:ring-offset-0"
                    />
                    <label
                      htmlFor="newsletter"
                      className="text-[13px] text-[#595959] leading-relaxed cursor-pointer"
                    >
                      Sign me up for the EST newsletter — race updates, destination
                      stories, and planning tips. Unsubscribe anytime.
                    </label>
                  </div>
                  <button
                    data-testid="form-submit"
                    type="submit"
                    disabled={loading}
                    className="btn-primary mt-4 px-8 py-5 text-[12px] tracking-[0.24em] uppercase font-semibold inline-flex items-center gap-3 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending…" : "Begin Planning"} {!loading && <ArrowUpRight size={14} />}
                  </button>
                  <p className="text-[11px] text-[#595959] leading-relaxed">
                    By submitting, you'll speak with an endurance travel planner — not
                    a booking bot. We do not sell discount packages, and we do not
                    share your information.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------- Home page ---------------------------- */

function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App" data-testid="app-root">
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <Philosophy />
        <Services />
        <Destinations />
        <Why />
        <Testimonials />
        <StartPlanning />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------------------- App Root ---------------------------- */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discipline/:slug" element={<DisciplinePage />} />
        <Route path="/referral" element={<Referral />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
