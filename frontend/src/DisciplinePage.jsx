import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { ArrowUpRight, ArrowLeft, MapPin } from "lucide-react";
import { Navigation, Footer } from "./shared";

const DISCIPLINES = {
  marathon: {
    title: "Marathon",
    description:
      "From the World Marathon Majors to hidden-destination races, we design the complete journey — training-block stays, race-week logistics, and post-race recovery time.",
    races: [
      { city: "Boston", race: "Boston Marathon", country: "USA", month: "April" },
      { city: "London", race: "TCS London Marathon", country: "UK", month: "April" },
      { city: "Berlin", race: "Berlin Marathon", country: "Germany", month: "September" },
      { city: "Chicago", race: "Chicago Marathon", country: "USA", month: "October" },
      { city: "New York", race: "NYC Marathon", country: "USA", month: "November" },
      { city: "Tokyo", race: "Tokyo Marathon", country: "Japan", month: "March" },
    ],
    features: [
      "Training-block retreats at altitude",
      "Race-week accommodation and transport",
      "Expo and race-day logistics",
      "Post-race recovery itineraries",
      "Multi-marathon grand tours",
    ],
  },
  "ultra-marathon": {
    title: "Ultra-Marathon",
    description:
      "Beyond 26.2 miles, the logistics multiply. We handle the remote locations, multi-day race windows, and the support infrastructure so you can focus on the miles.",
    races: [
      { city: "Utah", race: "Western States 100", country: "USA", month: "June" },
      { city: "Vermont", race: "Hardrock 100", country: "USA", month: "August" },
      { city: "South Africa", race: "Comrades Marathon", country: "South Africa", month: "June" },
      { city: "Greece", race: "Spartathlon", country: "Greece", month: "October" },
      { city: "New Zealand", race: "Transvertical", country: "New Zealand", month: "March" },
    ],
    features: [
      "Remote race logistics and shuttles",
      "Multi-day camp and accommodation planning",
      "Crew support travel coordination",
      "Cut-off and fallback planning",
      "Recovery and acclimatization stays",
    ],
  },
  triathlon: {
    title: "Triathlon",
    description:
      "Ironman, 70.3, or sprint — triathlon travel demands three-sport precision. We coordinate the training camps, race travel, and the transition from pool to open water to finish line.",
    races: [
      { city: "Kona", race: "IRONMAN World Championship", country: "Hawaii", month: "October" },
      { city: "Nice", race: "IRONMAN France", country: "France", month: "May" },
      { city: "Cozumel", race: "IRONMAN Mexico", country: "Mexico", month: "April" },
      { city: "St. George", race: "IRONMAN 70.3 World Championship", country: "USA", month: "June" },
      { city: "Lake Placid", race: "IRONMAN New York", country: "USA", month: "September" },
    ],
    features: [
      "Training camp and block-stay coordination",
      "Race-week equipment and transition logistics",
      "Spec and bike shipping",
      "Multi-athlete and relay team travel",
      "Post-race celebration planning",
    ],
  },
  cycling: {
    title: "Cycling",
    description:
      "Gran Fondos, stage races, and iconic climbs. We plan the riding trips that combine the world's greatest routes with the travel standards serious cyclists expect.",
    races: [
      { city: "New York", race: "Gran Fondo New York", country: "USA", month: "June" },
      { city: "French Alps", race: "Étape du Tour", country: "France", month: "July" },
      { city: "California", race: "Race the Eraser", country: "USA", month: "May" },
      { city: "Italy", race: "Giro di Fondi", country: "Italy", month: "September" },
      { city: "Slovenia", race: "Juliette", country: "Slovenia", month: "July" },
    ],
    features: [
      "Bike shipping and rental coordination",
      "Race and stage-route logistics",
      "Mechanic and support-vehicle planning",
      "Training camp in the Alps and beyond",
      "Post-ride recovery and dining itineraries",
    ],
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function DisciplinePage() {
  const { slug } = useParams();
  const discipline = DISCIPLINES[slug];

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
    window.scrollTo(0, 0);
    return () => lenis.destroy();
  }, []);

  if (!discipline) {
    return (
      <div className="App">
        <Navigation />
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32 text-center">
          <h1 className="font-serif-display text-4xl text-[#111111]">Discipline not found</h1>
          <Link to="/" className="text-[#2C3E35] underline mt-4 inline-block">
            Return home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App" data-testid="app-root">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-32 md:pt-40 pb-16 md:pb-24">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link
                to="/"
                className="eyebrow text-[#595959] inline-flex items-center gap-1.5 mb-6"
              >
                <ArrowLeft size={12} /> Back
              </Link>
              <h1 className="font-serif-display text-[48px] leading-[1.05] md:text-[80px] md:leading-[1] text-[#111111] tracking-tight">
                {discipline.title} Travel
              </h1>
              <p className="mt-6 md:mt-8 text-[16px] md:text-[18px] text-[#595959] max-w-2xl leading-relaxed">
                {discipline.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 border-t border-[#E5E3DB]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <div className="eyebrow mb-8">What We Handle</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discipline.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-[#111111] leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B08D57] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Races */}
        <section className="py-16 md:py-24 bg-[#2C3E35]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <div className="eyebrow text-[#B08D57]">Featured Races</div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {discipline.races.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-5"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-[#B08D57] flex-shrink-0" />
                      <div>
                        <div className="font-serif-display text-xl text-[#F7F5F0]">
                          {r.race}
                        </div>
                        <div className="text-[13px] text-[rgba(247,245,240,0.5)]">
                          {r.city}, {r.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-[12px] tracking-[0.18em] uppercase text-[rgba(247,245,240,0.4)] font-semibold">
                      {r.month}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="max-w-2xl"
            >
              <div className="eyebrow mb-6">Ready to Plan</div>
              <h2 className="font-serif-display text-[36px] md:text-[48px] text-[#111111] leading-tight">
                Let us design your {discipline.title.toLowerCase()} journey.
              </h2>
              <p className="mt-5 text-[15px] text-[#595959] leading-relaxed">
                Tell us the race you have in mind and we'll build a plan around
                your training, timeline, and preferences.
              </p>
              <a
                href="/#start"
                className="btn-primary mt-8 inline-flex items-center gap-3 px-8 py-5 text-[12px] tracking-[0.24em] uppercase font-semibold"
              >
                Begin Planning <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
