import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { login } from "../api/authService";

export default function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role.toLowerCase());
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("status",res.status);
      console.log(res.status);
      navigate(`/${res.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <Header />

      <div className="auth-container">
        <form className="auth-card" onSubmit={submit}>
          <h2>Login</h2>

          {error && <p className="error">{error}</p>}

          <input placeholder="Username"
            onChange={e => setForm({...form, username: e.target.value})} />

          <input type="password" placeholder="Password"
            onChange={e => setForm({...form, password: e.target.value})} />

          <select onChange={e => setForm({...form, role: e.target.value})}>
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="FARMER">Farmer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="RETAILER">Retailer</option>
          </select>

          <button>Login</button>

          <p>New user? <Link to="/register">Create Account</Link></p>
        </form>
      </div>
    </div>
  );
}
