import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  AtSign,
  ExternalLink,
  Heart,
} from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Home Visits", href: "/therapists" },
    { label: "Find Clinics", href: "/clinics" },
    { label: "Online Consultation", href: "/consultation" },
    { label: "Physio Dance", href: "/physio-dance" },
  ],
  Shop: [
    { label: "Pain Relief", href: "/shop?category=PAIN_RELIEF" },
    { label: "Massage Guns", href: "/shop?category=MASSAGE_GUNS" },
    { label: "Posture Slippers", href: "/shop?category=SLIPPERS" },
    { label: "All Products", href: "/shop" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-white/90 mt-auto">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="PhysioJoy Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-lg font-bold">
                <span className="text-primary-light">Physio</span>
                <span className="text-white">Joy</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              PhysioJoy by Joyal — Ahmedabad&apos;s premier physiotherapy platform. Book certified therapists,
              discover clinics, and shop premium recovery products — all in one place.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>Ahmedabad, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>hello@physiojoy.in</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-primary-light transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 mt-10 pt-8 border-t border-white/10">
          <span className="text-xs text-white/40 mr-2">Follow us</span>
          {[
            { icon: Globe, href: "#" },
            { icon: AtSign, href: "#" },
            { icon: ExternalLink, href: "#" },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors duration-200"
            >
              <Icon className="w-4 h-4 text-white/60" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} PhysioJoy by Joyal. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by{" "}
            <a
              href="https://github.com/umxng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light font-semibold hover:underline"
            >
              Umxng
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
