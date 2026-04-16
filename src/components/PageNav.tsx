import Link from "next/link";

export default function PageNav() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@600;700&display=swap');
        #page-nav {
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;align-items:center;justify-content:space-between;
          padding:24px 48px;
          background:linear-gradient(to bottom,rgba(0,0,0,.88),transparent);
        }
        .pnav-logo {
          font-family:'Orbitron',monospace;font-size:20px;font-weight:700;
          color:#fff;letter-spacing:2px;
          text-shadow:0 0 20px rgba(255,160,50,.5);
          text-decoration:none;
        }
        .pnav-links { display:flex;gap:36px;list-style:none;margin:0;padding:0; }
        .pnav-links a {
          font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:600;
          letter-spacing:3px;text-transform:uppercase;
          color:rgba(255,210,150,.6);text-decoration:none;transition:color .3s;
        }
        .pnav-links a:hover { color:#fff; }
        .pnav-cta {
          font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;
          letter-spacing:3px;text-transform:uppercase;
          color:#000;background:linear-gradient(135deg,#ffb347,#ff8c00);
          border:none;padding:10px 26px;cursor:pointer;transition:opacity .3s;
          text-decoration:none;display:inline-block;
        }
        .pnav-cta:hover { opacity:.85; }
        @media(max-width:768px) {
          #page-nav { padding:18px 24px; }
          .pnav-links { display:none; }
        }
      `}</style>
      <nav id="page-nav">
        <Link href="/" className="pnav-logo">EC</Link>
        <ul className="pnav-links">
          <li><Link href="/for-creators">Creators</Link></li>
          <li><Link href="/for-businesses">Businesses</Link></li>
          <li><Link href="/for-agencies">Agencies</Link></li>
          <li><Link href="/careers">Careers</Link></li>
        </ul>
        <Link href="mailto:createwithshaikh@gmail.com" className="pnav-cta">Get Started</Link>
      </nav>
    </>
  );
}
