import { Bell, CircleUserRound } from "lucide-react";

const Navbar = () => {
  return (
    <header className="navbar">
      <div>
        <h3>Vector Database Platform</h3>
        <p>Manage your AI infrastructure</p>
      </div>

      <div className="nav-actions">
        <Bell size={20} />
        <CircleUserRound size={25} />
      </div>
    </header>
  );
};

export default Navbar;