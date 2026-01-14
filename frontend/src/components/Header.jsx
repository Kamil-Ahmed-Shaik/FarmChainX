import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header">
      <h2>FarmChainX</h2>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}
