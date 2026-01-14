import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { register } from "../api/authService";

export default function Register() {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await register({ ...form, role });
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <Header />

      <div className="auth-container">
        <form className="auth-card" onSubmit={submit}>
          <h2>Register</h2>

          <select onChange={e => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="FARMER">Farmer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="RETAILER">Retailer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <input placeholder="Username"
            onChange={e => setForm({...form, username: e.target.value})} />

          <input type="password" placeholder="Password"
            onChange={e => setForm({...form, password: e.target.value})} />

          {role === "FARMER" && (
            <>
              <input placeholder="Farm Name" onChange={e => setForm({...form, farmName:e.target.value})} />
              <input placeholder="Crop Type" onChange={e => setForm({...form, cropType:e.target.value})} />
              <input placeholder="Location" onChange={e => setForm({...form, location:e.target.value})} />
              <input placeholder="Farm Location" onChange={e => setForm({...form, farmLocation:e.target.value})} />
            </>
          )}
          {role === "DISTRIBUTOR" && (
            <>
              <input placeholder="Company Name" onChange={e => setForm({...form, companyName:e.target.value})} />
              <input placeholder="Region" onChange={e => setForm({...form, region:e.target.value})} />
            </>
          )}
          {role === "RETAILER" && (
            <>
              <input placeholder="Shop Name" onChange={e => setForm({...form, shopName:e.target.value})} />
              <input placeholder="Location" onChange={e => setForm({...form, location:e.target.value})} />
            </>
          )}
          {role === "ADMIN" && (
            <input placeholder="Department" onChange={e => setForm({...form, department:e.target.value})} />
          )}

          <button>Register</button>
        </form>
      </div>
    </div>
  );
}
