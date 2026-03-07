import { NavLink } from "react-router-dom";
import "../styles/sideMenu.css";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
  if (!open) return null;

  return (
    <>
      <div className="menu-overlay" onClick={onClose} />

      <div className="side-menu">
        <NavLink to="/journal" onClick={onClose} className="menu-link">
          Journal
        </NavLink>

        <NavLink to="/entries" onClick={onClose} className="menu-link">
          Entries
        </NavLink>
      </div>
    </>
  );
}
