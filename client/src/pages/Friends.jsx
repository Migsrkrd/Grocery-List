import React, { useState, useEffect } from "react";
import ProfileNav from "../components/ProfileNav";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_USERS } from "../utils/queries";
import { CREATE_NOTIFICATION, REMOVE_FRIEND } from "../utils/mutations";
import Auth from "../utils/auth";

const Friends = () => {
  const { loading, error, data } = useQuery(QUERY_ME);
  const { loading: loadingUsers, data: dataUsers } = useQuery(QUERY_USERS);

  const [searchQuery, setSearchQuery] = useState("");
  const [friendIcons, setFriendIcons] = useState({});
  const [hasInteracted, setHasInteracted] = useState(false);

  const [addFriendMutation] = useMutation(CREATE_NOTIFICATION);
  const [removeFriendMutation] = useMutation(REMOVE_FRIEND);

  console.log("datausers",dataUsers);

  useEffect(() => {
    if (dataUsers && dataUsers.users) {
      const initialFriendIcons = {};
      dataUsers.users.forEach((user) => {
        initialFriendIcons[user._id] = "fas fa-user-plus";
      });
      setFriendIcons(initialFriendIcons);
    }
  }, [dataUsers]);

  if (loading || loadingUsers || !dataUsers) return <div className="loader"></div>;

  const { me } = data;

  const filteredUsers = searchQuery
    ? dataUsers.users.filter(
        (user) =>
          (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
          user._id !== me._id
      )
    : [];

  const isFriend = (userId) => {
    return me.friends.some((friend) => friend._id === userId);
  };

  const handleAddFriend = async (friendId) => {
    try {
      await addFriendMutation({
        variables: {
          userId: friendId,
          text: `${Auth.getProfile().data.username} wants to add you as a friend!`,
        },
        refetchQueries: [{ query: QUERY_ME }],
      });

      setFriendIcons((prevIcons) => ({
        ...prevIcons,
        [friendId]: "fa-solid fa-check",
      }));
    } catch (error) {
      console.error("Error adding friend:", error.message);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriendMutation({
        variables: { friendId },
        refetchQueries: [{ query: QUERY_ME }],
      });
    } catch (error) {
      console.error("Error removing friend:", error.message);
    }
  };

  return (
    <div className="friends">
      <ProfileNav />
      <div className="friends-area">
        <div className="current-friends">
          <h2 className="friends-title">Friends ({me.friends.length})</h2>
          <p className="border-top"></p>
          {me.friends.map((friend) => (
            <ul key={friend._id} className="friends-list">
              <li>
                @{friend.username}
                <i onClick={() => handleRemoveFriend(friend._id)} className="fa-solid fa-x remfriend"></i>
              </li>
            </ul>
          ))}
        </div>
        <div className="searching-friends">
          <h2>Search Friends</h2>
          <form>
            <input
              className="search-friends"
              type="text"
              placeholder="Search for a friend"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHasInteracted(true);
              }}
            />
          </form>
          {hasInteracted && searchQuery && (
            <ul className="search-results">
              {filteredUsers.map((user) => (
                <li key={user._id} className="search-result">
                  <span className="search-username">@{user.username}</span> ({user.email})
                  {!isFriend(user._id) && (
                    <i
                      className={friendIcons[user._id]}
                      id="addfriend"
                      onClick={() => handleAddFriend(user._id)}
                    ></i>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
