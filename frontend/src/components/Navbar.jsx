import { Bell, CircleUserRound } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { Sun, Moon } from "lucide-react";
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (

    <header className="navbar">
      <div>
        <h3>Vector Database Platform</h3>
        <p>Manage your AI infrastructure</p>
      </div>

      <div className="nav-actions">
        <button onClick={toggleTheme} className="theme-toggle">
    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    {theme === "light" ? "Dark Mode" : "Light Mode"}
</button>
        <Bell size={20} />
        <CircleUserRound size={25} />
      </div>
      
    </header>
  );
};

export default Navbar;