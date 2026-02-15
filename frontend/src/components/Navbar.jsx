import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);


  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItemStyle = (path) => ({
    cursor: "pointer",
    padding: "8px 14px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    background:
      location.pathname === path
        ? darkMode
          ? "#1e293b"
          : "rgba(255,255,255,0.2)"
        : "transparent"
  });

  return (
    <div
      style={{
        background: darkMode ? "#0f172a" : "#4f46e5",
        padding: "15px 40px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}
    >
      {/* Left Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <h2
          style={{ cursor: "pointer", margin: 0 }}
          onClick={() => navigate("/dashboard")}
        >
          TypeTrack 🚀
        </h2>

        <div style={{ display: "flex", gap: "20px" }}>
          <span
            style={navItemStyle("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </span>

          <span
            style={navItemStyle("/test")}
            onClick={() => navigate("/test")}
          >
            Typing Test
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "white",
            color: darkMode ? "#0f172a" : "#4f46e5",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
