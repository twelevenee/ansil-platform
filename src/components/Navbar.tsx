import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "대시보드", href: "/" },
  { label: "지원제도", href: "/programs" },
  { label: "AI 상담", href: "/chat" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container flex h-14 items-center justify-between md:h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-secondary">안심찾기</span>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors hover:bg-primary-light hover:text-primary ${
                location.pathname === item.href ? "bg-primary-light text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle — 44px touch target */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px]"
          onClick={() => setOpen(!open)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu with backdrop and slide animation */}
      <div
        className={`fixed inset-0 top-14 z-40 transition-all duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        {/* Menu panel */}
        <nav
          className={`relative border-t bg-card shadow-lg transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-6 py-4 text-base font-medium transition-colors active:bg-primary-light ${
                location.pathname === item.href
                  ? "bg-primary-light text-primary"
                  : "text-muted-foreground hover:bg-primary-light hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
