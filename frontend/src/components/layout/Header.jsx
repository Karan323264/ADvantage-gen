import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

function PublicHeader({ openLogin, openSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
    { name: "APIs", href: "#apis" },
    { name: "Report", href: "#report" },
    { name: "Testimony", href: "#testimony" },
  ];

  const getInitial = () => {
    if (!user?.name) return "";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-slate-200 py-3"
          : "bg-white/90 backdrop-blur-md border-b border-slate-200 py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-12 flex items-center justify-between relative z-50">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight flex items-center"
        >
          <span className="text-slate-900">
            AdVantage{" "}
          </span>

          <span className="ai-gradient">
            Gen
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-14 text-sm font-medium text-slate-600 relative z-50">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative group"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6 relative z-50">

          {isAuthenticated && (
            <Link
              to="/dashboard/history"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition"
            >
              Memories
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>

              {/* Profile Circle */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold shadow-md hover:scale-105 transition-transform"
              >
                {getInitial()}
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-3 w-44 bg-white border border-slate-200 rounded-xl shadow-xl transition-all duration-200 z-50 ${
                  dropdownOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                }`}
              >
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 rounded-t-xl">
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 rounded-b-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Login
              </button>

              <button
                onClick={openSignup}
                className="px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition shadow-sm"
              >
                Sign Up
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default PublicHeader;