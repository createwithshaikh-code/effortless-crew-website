import Link from "next/link";
import SiteLogo from "@/components/common/SiteLogo";
import { Youtube, Instagram, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Video Editing", href: "/services/video-editing" },
    { label: "YouTube Automation", href: "/services/youtube-automation" },
    { label: "Short Form", href: "/services/short-form" },
    { label: "Motion Graphics", href: "/services/motion-graphics" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Youtube, href: "#", label: "YouTube", hoverColor: "hover:text-brand-400 hover:border-brand/30" },
  { icon: Instagram, href: "#", label: "Instagram", hoverColor: "hover:text-brand-300 hover:border-brand/30" },
  { icon: Twitter, href: "#", label: "Twitter", hoverColor: "hover:text-royal-400 hover:border-royal/30" },
  { icon: Linkedin, href: "#", label: "LinkedIn", hoverColor: "hover:text-royal-300 hover:border-royal/30" },
];

export default function Footer() {
  return (
    <footer className="bg-[#020210] border-t border-white/5 relative overflow-hidden">
      {/* Subtle footer glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] orb orb-magenta opacity-5" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[150px] orb orb-blue opacity-5" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-5">
              <div className="group-hover:scale-110 transition-transform">
                <SiteLogo />
              </div>
              <span className="ec-highlight text-lg tracking-tight">Effortless Crew</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              We make creators look legendary. Premium video editing and content
              creation services for YouTubers, brands, and businesses.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-xl glass border border-white/8 flex items-center justify-center text-white/35 transition-all duration-300 hover:scale-110 ${social.hoverColor}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display text-white font-semibold text-sm mb-4 tracking-wide">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} <span className="ec-highlight">Effortless Crew</span>. All rights reserved.
          </p>
          <p className="text-white/25 text-sm">
            Making creators legendary, one frame at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
