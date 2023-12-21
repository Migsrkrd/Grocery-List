import React from "react";
import { Link, useLocation } from "react-router-dom";

const ProfileNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    // Check if the current path matches the provided path
    return location.pathname === path;
  };

  return (
    <div className="second-nav">
      <ul className="profile-nav">
        <li>
          <Link className={isActive("/dashboard") ? "active" : ""} to={"/dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link className={isActive("/Friends") ? "active" : ""} to="/Friends">Friends</Link>
        </li>
        <li>
          <Link className={isActive("/profile/settings") ? "active" : ""} to="/profile/settings">Settings</Link>
        </li>
        <li>
          <Link className={isActive("/profile/notifications") ? "active" : ""} to="/profile/notifications">Notifications</Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileNav;
