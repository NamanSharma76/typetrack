import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "400px", margin: "100px auto", position: "relative" }}>

        <button
            onClick={toggleTheme}
            style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                border: "none"
            }}>
            {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>


        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="btn"
            style={{ width: "100%", marginTop: "10px" }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
