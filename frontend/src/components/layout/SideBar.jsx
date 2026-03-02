import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white/70 backdrop-blur-md p-6">
      <nav className="space-y-4 text-sm font-medium text-slate-700">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "block px-4 py-2 rounded-lg bg-slate-900 text-white"
              : "block px-4 py-2 rounded-lg hover:bg-slate-100"
          }
        >
          Dashboard
        </NavLink>

      </nav>
    </aside>
  );
}

export default Sidebar;