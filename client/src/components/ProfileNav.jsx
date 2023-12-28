import React from "react";
import { Link, useLocation } from "react-router-dom";
import { QUERY_ME } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { MARK_NOTIFICATION_READ } from "../utils/mutations";

const ProfileNav = () => {
  const [markNotificationReadMutation] = useMutation(MARK_NOTIFICATION_READ);

  const location = useLocation();

  const isActive = (path) => {
    // Check if the current path matches the provided path
    return location.pathname === path;
  };

  const { loading, error, data } = useQuery(QUERY_ME);

  if (loading) return <div className="loader"></div>;

  const { me } = data;

  const handleReadNotifications = async () => {
    for(let i = 0; i < me.notifications.length; i++) {
      if(!me.notifications[i].isRead) {
        await markNotificationReadMutation({
          variables: { notificationId: me.notifications[i]._id },
          refetchQueries: [{ query: QUERY_ME }],
        });
      }
    }
  }

  return (
    <div className="second-nav">
      <ul className="profile-nav">
        <li>
          <Link
            className={isActive("/dashboard") ? "active" : ""}
            to={"/dashboard"}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link className={isActive("/Friends") ? "active" : ""} to="/Friends">
            Friends
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/received") ? "active" : ""}
            to="/received"
          >
            Received Lists
          </Link>
        </li>
        <li>
          <Link onClick={handleReadNotifications} className={isActive("/notifications") ? "active" : ""} to="/notifications">
            Notifications
            {me.notifications.some((notification) => !notification.isRead) && (
              <i className="fas fa-bell alertBell"></i>
            )}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileNav;
