import React, {
  useState,
  useMemo,
  useRef,
  useEffect
} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useTheme } from "../../contexts/ThemeContext";
import CartModal from "../cart/CartModal";
import ThemeSwitch from "../common/ThemeSwitch";

/* ---------- NAV ITEMS ---------- */
const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/blog", label: "Blog" },
  { to: "/contacto", label: "Contacto" },
];

export default function Header() {
  const { user, signOut, loading } = useAuth();
  const { state } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  /* ---------- CARRITO ---------- */
  const cartCount = useMemo(
    () => state.items.reduce((s, i) => s + i.quantity, 0),
    [state.items]
  );

  /* ---------- CLICK FUERA ---------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    signOut();
    navigate("/login");
    setUserMenuOpen(false);
  };

  /* ---------- USER INFO ---------- */
  const userInitials = user?.name
    ? `${user.name[0]}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const userName = user?.name
    ? `${user.name} ${user.lastName || ""}`.trim()
    : user?.email || "Usuario";

  /* ---------- CLASSES ---------- */
  const headerClass = `fixed-top shadow-sm ${
    isDark ? "bg-dark text-light" : "bg-white"
  }`;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link mx-2 ${
      isActive
        ? "text-primary fw-bold text-decoration-underline"
        : isDark
        ? "text-light"
        : "text-body"
    }`;

  const dropdownStyle = {
    backgroundColor: isDark ? "#343a40" : "#fff",
    color: isDark ? "#f8f9fa" : "#212529",
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <header className={headerClass} style={{ zIndex: 1000 }}>
        <div className="container d-flex justify-content-between py-3">
          <Link className="h4 text-primary text-decoration-none" to="/">
            Fashion<span style={{ color: "#ff006e" }}>Style</span>
          </Link>
          <div className="spinner-border spinner-border-sm text-primary" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={headerClass} style={{ zIndex: 1000 }}>
        <div className="container d-flex align-items-center justify-content-between py-3">
          {/* LOGO */}
          <Link className="h4 text-primary text-decoration-none" to="/">
            Fashion<span style={{ color: "#ff006e" }}>Style</span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="d-none d-md-flex">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="d-flex align-items-center gap-3">
            <ThemeSwitch />

            {/* USER */}
            {user ? (
              <div className="dropdown" ref={userMenuRef}>
                <button
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                  onClick={() => setUserMenuOpen(v => !v)}
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, fontSize: 12 }}
                  >
                    {userInitials}
                  </div>
                  <span className="d-none d-lg-inline">{userName}</span>
                  <i className={`bi bi-chevron-${userMenuOpen ? "up" : "down"}`} />
                </button>

                {userMenuOpen && (
                  <div
                    className="dropdown-menu show shadow border-0 mt-2"
                    style={{
                      ...dropdownStyle,
                      right: 0,
                      left: "auto",
                      minWidth: 200,
                    }}
                  >
                    <div className="dropdown-header">
                      <strong>{userName}</strong>
                      <small className="d-block text-muted">{user.email}</small>
                    </div>

                    {user.role === "ADMIN" && (
                      <>
                        <div className="dropdown-divider" />
                        <Link
                          className="dropdown-item text-primary fw-semibold"
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                        >
                           Panel Admin
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn btn-outline-primary btn-sm d-none d-md-inline"
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm d-none d-md-inline"
                >
                  Iniciar sesión
                </Link>
              </>
            )}

            {/* CART */}
            <button
              className="btn btn-primary btn-sm position-relative"
              onClick={() => setCartOpen(true)}
            >
              🛒
              {cartCount > 0 && (
                <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* NAV MOBILE */}
        <div
          className={`container d-md-none py-2 border-top ${
            isDark ? "border-secondary" : "border-light"
          }`}
        >
          <div className="d-flex justify-content-around">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* CART MODAL */}
      {cartOpen && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 2000, top: 84 }}
        >
          <div className="card" style={{ width: 380 }}>
            <div className="card-body">
              <CartModal onClose={() => setCartOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}