import {
  LayoutDashboard,
  Database,
  Search,
  ChartNoAxesColumn,
  Brain,
  Compass
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Vectors",
      path: "/vectors",
      icon: Database,
    },
    {
      name: "Similarity Search",
      path: "/search",
      icon: Search,
    },
    {
      name: "Benchmark",
      path: "/benchmark",
      icon: ChartNoAxesColumn,
    },
    {
      name:"Explore",
      path:"/explore",
      icon:Compass

    }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <Brain size={28} />
        <h2>Your Own AI</h2>
      </div>

      <p className="menu-label">MENU</p>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
            
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;