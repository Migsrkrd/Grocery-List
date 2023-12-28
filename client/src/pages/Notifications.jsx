import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { useMutation } from "@apollo/client";
import { ADD_FRIEND, REMOVE_NOTIFICATION, CREATE_NOTIFICATION } from "../utils/mutations";
import ProfileNav from "../components/ProfileNav";

const Notifications = () => {
  const { loading, error, data } = useQuery(QUERY_ME);
  const [addFriendMutation] = useMutation(ADD_FRIEND);
  const [removeNotificationMutation] = useMutation(REMOVE_NOTIFICATION);
  const [createNotificationMutation] = useMutation(CREATE_NOTIFICATION);

    const handleAcceptFriendRequest = async (notification) => {
        const friendId = notification.senderId;
        try {
            await addFriendMutation({
                variables: { friendId: friendId },
                refetchQueries: [{ query: QUERY_ME }],
            });
            await removeNotificationMutation({
                variables: { notificationId: notification._id },
                refetchQueries: [{ query: QUERY_ME }],
            });
            await createNotificationMutation({
                variables: { userId: friendId, text: `${data.me.username} accepted your friend request!` },
                refetchQueries: [{ query: QUERY_ME }],
            });
        } catch (error) {
            console.error("Error adding friend:", error.message);
        }
    }

    const handleIgnoreFriendRequest = async (notification) => {
        try {
            await removeNotificationMutation({
                variables: { notificationId: notification._id },
                refetchQueries: [{ query: QUERY_ME }],
            });
        } catch (error) {
            console.error("Error adding friend:", error.message);
        }
    }

    if (loading) return <div className="loader"></div>;

    const { me } = data;
  
    // Sort notifications by dateCreated in descending order
    const sortedNotifications = me.notifications
      .slice()
      .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
  
    const amountOfUnreadNotifications = me.notifications.filter(
      (notification) => !notification.isRead
    ).length;
  
    return (
      <div className="notifications">
        <ProfileNav />
        <h1>
          Notifications{" "}
          <span className="not-amount">({amountOfUnreadNotifications})</span>
        </h1>
        <ul className="notifications-list">
          {sortedNotifications.slice(0, 10).map((notification) => (
            <li
              key={notification._id}
              className="unReadNotification"
            >
              <p>{notification.text}</p>
              <p>Date Created: {notification.dateCreated}</p>
              {notification.text.includes("wants to add you as a friend!") && (
                <div>
                  <button className="addFriendButton" onClick={() => handleAcceptFriendRequest(notification)}>
                    Accept
                  </button>
                  <button className="addFriendButton" onClick={() => handleIgnoreFriendRequest(notification)}>
                    Ignore
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Notifications;