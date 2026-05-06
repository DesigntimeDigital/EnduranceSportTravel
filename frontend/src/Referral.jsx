import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { ArrowUpRight, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const REFERRAL_PASSWORD = "finishline"; // shared privately with clients

const ATHLETES = [
  { initials: "HM", discipline: "Triathlon", race: "Ironman World Championship", location: "Kona, HI", year: 2024, result: "AG Podium · 2nd" },
  { initials: "AB", discipline: "Marathon", race: "Berlin Marathon", location: "Berlin, DE", year: 2024, result: "Personal Best · 2:58:41" },
  { initials: "MI", discipline: "Triathlon", race: "Ironman France", location: "Nice, FR", year: 2024, result: "Finisher · Qualifier" },
  { initials: "JR", discipline: "Cycling", race: "Gran Fondo New York", location: "New York, NY", year: 2023, result: "Top 10%" },
  { initials: "CK", discipline: "Marathon", race: "Boston Marathon", location: "Boston, MA", year: 2023, result: "Personal Best · 3:12:05" },
  { initials: "DP", discipline: "Triathlon", race: "Ironman 70.3 Worlds", location: "St. George, UT", year: 2023, result: "AG Podium · 3rd" },
  { initials: "SW", discipline: "Marathon", race: "NYC Marathon", location: "New York, NY", year: 2023, result: "Finisher · Sub-4:00" },
  { initials: "TF", discipline: "Cycling", race: "Étape du Tour", location: "French Alps", year: 2022, result: "Mountain Finisher" },
  { initials: "RG", discipline: "Triathlon", race: "Ironman Kona", location: "Kona, HI", year: 2022, result: "AG Top 20" },
  { initials: "LM", discipline: "Marathon", race: "Tokyo Marathon", location: "Tokyo, JP", year: 2022, result: "Six-Star Finisher" },
  { initials: "EH", discipline: "Cycling", race: "Paris-Roubaix Challenge", location: "Roubaix, FR", year: 2022, result: "Finisher" },
  { initials: "NB", discipline: "Triathlon", race: "Ironman Lake Placid", location: "Lake Placid, NY", year: 2021, result: "AG Podium · 1st" },
  { initials: "VT", discipline: "Marathon", race: "London Marathon", location: "London, UK", year: 2021, result: "Six-Star Finisher" },
  { initials: "OP", discipline: "Triathlon", race: "Ironman Cozumel", location: "Cozumel, MX", year: 2021, result: "Finisher · Qualifier" },
  { initials: "FR", discipline: "Cycling", race: "Haute Route Alps", location: "French Alps", year: 2020, result: "7-Day Stage Finisher" },
  { initials: "AK", discipline: "Marathon", race: "Chicago Marathon", location: "Chicago, IL", year: 2019, result: "Personal Best · 2:49:17" },
];

/* ---------------------------- Gate ---------------------------- */
const Gate = ({ onUnlock }) => {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pwd.trim().toLowerCase() === REFERRAL_PASSWORD) {
      try { sessionStorage.setItem("est_referral", "1"); } catch { /* ignore */ }
      onUnlock();
    } else {
      setError("Passphrase not recognised. Please contact your planner.");
    }
  };

  return (
    <div
      data-testid="referral-gate"
      className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col"
    >
      {/* Top bar */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 pt-8 pb-6 flex items-center justify-between">
        <Link
          to="/"
          data-testid="referral-back-home"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-semibold text-[#595959] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={14} /> Return to Endurance Sport Travel
        </Link>
        <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-semibold text-[#2C3E35]">
          <Lock size={13} /> By Referral
        </div>
      </div>

      <div className="flex-1 flex items-center">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 py-16 grid grid-cols-12 gap-6 md:gap-10 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="eyebrow mb-8 text-[#2C3E35]">Vault · Private Index</div>
            <h1 className="font-serif-display text-[48px] md:text-[88px] leading-[0.98] tracking-tight text-[#111111]">
              A quiet record of
              <br />
              <span className="italic text-[#2C3E35]">athletes we have served.</span>
            </h1>
            <p className="mt-8 font-sans-body text-[15px] md:text-[16px] leading-[1.75] text-[#595959] max-w-xl">
              This directory is not listed publicly. It is shared by passphrase with
              prospective clients introduced through our network. If you are here, an
              athlete or planner has vouched for you.
            </p>
            <div className="mt-10 rule" />
            <p className="mt-6 text-[12px] tracking-[0.22em] uppercase font-semibold text-[#595959]">
              No discounts · No packages · By introduction only
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white border border-[#E5E3DB] p-8 md:p-10">
              <div className="eyebrow text-[#2C3E35] mb-6">Enter Passphrase</div>

              <form onSubmit={submit} className="space-y-6">
                <div className="relative">
                  <input
                    data-testid="referral-password-input"
                    type={show ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => {
                      setPwd(e.target.value);
                      if (error) setError("");
                    }}
                    autoFocus
                    className="w-full border-b border-[#E5E3DB] bg-transparent py-3 pr-10 font-serif-display text-2xl text-[#111111] focus:outline-none focus:border-[#2C3E35] transition-colors tracking-wide"
                    placeholder="Shared with you by your planner"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    data-testid="referral-password-toggle"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#595959] hover:text-[#111111] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <div
                    data-testid="referral-error"
                    className="text-[13px] font-serif-display italic text-[#8A3324]"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  data-testid="referral-unlock"
                  className="btn-primary w-full px-8 py-5 text-[12px] tracking-[0.24em] uppercase font-semibold inline-flex items-center justify-center gap-3"
                >
                  Enter the Vault <ArrowUpRight size={14} />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#E5E3DB]">
                <div className="eyebrow text-[#595959] mb-3">No Passphrase?</div>
                {requesting ? (
                  <div
                    data-testid="referral-request-sent"
                    className="font-serif-display italic text-[#2C3E35] text-lg"
                  >
                    Noted. A planner will be in touch.
                  </div>
                ) : (
                  <button
                    onClick={() => setRequesting(true)}
                    data-testid="referral-request-access"
                    className="link-underline text-[12px] tracking-[0.22em] uppercase font-semibold text-[#111111]"
                  >
                    Request an Introduction →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------- Directory ---------------------------- */
const disciplines = ["All", "Marathon", "Triathlon", "Cycling"];

const Directory = () => {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? ATHLETES : ATHLETES.filter((a) => a.discipline === filter);

  return (
    <div data-testid="referral-directory" className="min-h-screen bg-[#F7F5F0] text-[#111111]">
      {/* Header bar */}
      <div className="border-b border-[#E5E3DB] bg-[#F7F5F0]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link
            to="/"
            data-testid="directory-home-link"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-semibold text-[#595959] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft size={14} /> Home
          </Link>
          <div className="font-serif-display text-lg md:text-xl tracking-tight">
            The Vault <span className="italic text-[#2C3E35]">· By Referral</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-semibold text-[#2C3E35]">
            <Lock size={13} /> Private
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 lg:col-span-8">
              <div className="eyebrow mb-6 text-[#2C3E35]">A Private Record</div>
              <h2 className="font-serif-display text-[40px] md:text-[80px] leading-[1.02] tracking-tight text-[#111111]">
                Names redacted.
                <br />
                <span className="italic text-[#2C3E35]">Finish lines remembered.</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <p className="text-[14px] md:text-[15px] leading-[1.75] text-[#595959]">
                A partial index of athletes we have planned for — initialled for
                discretion. Full references are available by request once an
                engagement begins.
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="mt-16 flex items-center gap-8 border-t border-b border-[#E5E3DB] py-5 overflow-x-auto">
            <span className="eyebrow text-[#595959] shrink-0">Filter</span>
            {disciplines.map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                data-testid={`directory-filter-${d.toLowerCase()}`}
                className={`text-[12px] tracking-[0.22em] uppercase font-semibold transition-colors shrink-0 ${
                  filter === d
                    ? "text-[#111111]"
                    : "text-[#595959] hover:text-[#111111]"
                }`}
              >
                {d}
                {filter === d && (
                  <motion.span
                    layoutId="filter-underline"
                    className="block h-px bg-[#2C3E35] mt-1"
                  />
                )}
              </button>
            ))}
            <span className="ml-auto eyebrow text-[#595959] shrink-0">
              {filtered.length} entries
            </span>
          </div>

          {/* Entries */}
          <div className="mt-4">
            {filtered.map((a, i) => (
              <motion.div
                key={a.initials + a.year + a.race}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.25) }}
                className="grid grid-cols-12 gap-4 md:gap-6 py-6 md:py-7 border-b border-[#E5E3DB] items-center hover:bg-white transition-colors duration-500"
                data-testid={`directory-entry-${i}`}
              >
                <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                  <span className="font-serif-display text-xl md:text-2xl text-[#2C3E35]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-3 md:col-span-2">
                  <div className="w-11 h-11 md:w-12 md:h-12 border border-[#2C3E35] flex items-center justify-center font-serif-display text-base md:text-lg text-[#2C3E35] tracking-wider">
                    {a.initials}
                  </div>
                </div>
                <div className="col-span-7 md:col-span-3">
                  <div className="eyebrow text-[#595959]">{a.discipline}</div>
                  <div className="font-serif-display text-xl md:text-2xl text-[#111111] tracking-tight mt-1 leading-tight">
                    {a.race}
                  </div>
                </div>
                <div className="col-span-6 md:col-span-3 text-[13px] md:text-[14px] font-serif-display italic text-[#595959]">
                  {a.location}
                </div>
                <div className="col-span-4 md:col-span-2 text-[12px] tracking-[0.2em] uppercase font-semibold text-[#111111]">
                  {a.result}
                </div>
                <div className="col-span-2 md:col-span-1 text-right font-serif-display text-lg text-[#2C3E35]">
                  {a.year}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 md:py-32 bg-[#111111] text-[#F7F5F0]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 lg:col-span-8">
            <div className="eyebrow text-[#F7F5F0]/60 mb-6">Privately Yours</div>
            <h3 className="font-serif-display text-[36px] md:text-[64px] leading-[1.04] tracking-tight">
              If you've seen enough,
              <br />
              <span className="italic text-[#B08D57]">we should talk.</span>
            </h3>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Link
              to="/#start"
              data-testid="directory-cta-start"
              className="btn-primary inline-flex items-center justify-center gap-3 px-8 py-5 text-[12px] tracking-[0.24em] uppercase font-semibold w-full"
            >
              Begin a Conversation <ArrowUpRight size={14} />
            </Link>
            <p className="mt-4 text-[11px] tracking-[0.22em] uppercase font-semibold text-[#F7F5F0]/50">
              By introduction · Never discounted
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ---------------------------- Page root ---------------------------- */
const Referral = () => {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("est_referral") === "1") setUnlocked(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return unlocked ? <Directory /> : <Gate onUnlock={() => setUnlocked(true)} />;
};

export default Referral;
