import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
            }}
            >
            {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>


        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

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
            Register
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
