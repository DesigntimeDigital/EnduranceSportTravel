import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Menu, X, MapPin, Lock } from "lucide-react";

/* ---------------------------- Navigation ---------------------------- */
export const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Run", href: "#run" },
    { label: "Triathlon", href: "#triathlon" },
    { label: "Cycling", href: "#cycling" },
    { label: "Destinations", href: "#destinations" },
    { label: "Philosophy", href: "#philosophy" },
  ];

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#F7F5F0]/80 border-b border-[#E5E3DB]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-36 flex items-center justify-between">
        <Link
          to="/"
          data-testid="logo-link"
          className="flex items-center"
        >
          <img
            src="/est-logo.svg"
            alt="Endurance Sport Travel"
            className="h-32 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className="link-underline text-[13px] tracking-wide text-[#111111] hover:text-[#2C3E35]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#start"
            data-testid="nav-start-planning"
            className="btn-primary px-6 py-3 text-[12px] tracking-[0.2em] uppercase font-semibold inline-flex items-center gap-2"
          >
            Start Planning <ArrowUpRight size={14} />
          </a>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className="lg:hidden text-[#111111]"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[#F7F5F0] border-t border-[#E5E3DB]">
          <div className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif-display text-2xl text-[#111111]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#start"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 px-6 py-4 text-[12px] tracking-[0.2em] uppercase font-semibold text-center"
            >
              Start Planning
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

/* ---------------------------- Footer ---------------------------- */
export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="bg-[#F7F5F0] border-t border-[#E5E3DB]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5">
            <img
              src="/est-logo.svg"
              alt="Endurance Sport Travel"
              className="h-52 w-auto"
            />
            <p className="mt-6 text-[14px] text-[#595959] max-w-sm leading-relaxed">
              A division of Outdoor Travel Adventures. Designing race journeys for
              marathon, triathlon, and cycling athletes since 1996.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="eyebrow mb-4">Disciplines</div>
            <ul className="space-y-2 text-[14px] text-[#111111]">
              <li><Link to="/discipline/marathon" className="link-underline">Marathon</Link></li>
              <li><Link to="/discipline/ultra-marathon" className="link-underline">Ultra-Marathon</Link></li>
              <li><Link to="/discipline/triathlon" className="link-underline">Triathlon</Link></li>
              <li><Link to="/discipline/cycling" className="link-underline">Cycling</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="eyebrow mb-4">Studio</div>
            <ul className="space-y-2 text-[14px] text-[#111111]">
              <li><a href="#philosophy" className="link-underline">Philosophy</a></li>
              <li><a href="#why" className="link-underline">Heritage</a></li>
              <li><a href="#destinations" className="link-underline">Destinations</a></li>
              <li>
                <Link
                  to="/referral"
                  data-testid="footer-referral-link"
                  className="link-underline inline-flex items-center gap-1.5 text-[#595959]"
                >
                  <Lock size={11} /> By Referral
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <div className="eyebrow mb-4">Contact</div>
            <div className="flex items-start gap-2 text-[14px] text-[#111111]">
              <MapPin size={16} className="mt-1 text-[#2C3E35]" />
              <div>
                <div>Outdoor Travel Adventures</div>
                <div className="text-[#595959]">United States</div>
              </div>
            </div>
            <a
              href="#start"
              data-testid="footer-cta"
              className="mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase font-semibold text-[#111111] link-underline"
            >
              Begin a Journey <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#E5E3DB] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#595959] font-semibold">
            © {new Date().getFullYear()} Endurance Sport Travel · A Division of
            Outdoor Travel Adventures
          </div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#595959] font-semibold">
            Bespoke · Never Discounted
          </div>
        </div>
      </div>
    </footer>
  );
};
