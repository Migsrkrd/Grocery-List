import React, { useState } from "react";
import ProfileNav from "../components/ProfileNav";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_USERS } from "../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND } from "../utils/mutations";

const Friends = () => {
  // Fetching data using useQuery
  const { loading, error, data } = useQuery(QUERY_ME);
  const { loading: loadingUsers, data: dataUsers } = useQuery(QUERY_USERS);

  const [searchQuery, setSearchQuery] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  // Mutation hook for adding a friend
  const [addFriendMutation] = useMutation(ADD_FRIEND);
  // Mutation hook for removing a friend
  const [removeFriendMutation] = useMutation(REMOVE_FRIEND);

  if (loading || loadingUsers) return <p>Loading...</p>;

  const { me } = data;

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? dataUsers.users.filter(
        (user) =>
          (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
          user._id !== me._id // Exclude the current user from search results
      )
    : [];

  // Check if a user is already a friend
  const isFriend = (userId) => {
    return me.friends.some((friend) => friend._id === userId);
  };

  // Function to handle adding a friend
  const handleAddFriend = async (friendId) => {
    try {
      await addFriendMutation({
        variables: { friendId },
        refetchQueries: [{ query: QUERY_ME }],
      });
      // window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error("Error adding friend:", error.message);
      // window.location.reload();
    }
  };

  // Function to handle removing a friend
  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriendMutation({
        variables: { friendId },
        refetchQueries: [{ query: QUERY_ME }],
      });
      // window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error("Error removing friend:", error.message);
      // window.location.reload();
    }
  };

  return (
    <div className="friends">
      <ProfileNav />
      <div className="friends-area">
        <div className="current-friends">
          <h2 className="friends-title">Friends ({me.friends.length})</h2>
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
                setHasInteracted(true); // Set hasInteracted to true on input change
              }}
            />
          </form>
          {hasInteracted && searchQuery && (
            <ul className="search-results">
              {filteredUsers.map((user) => (
                <li key={user._id} className="search-result">
                  <span className="search-username">@{user.username}</span> ({user.email})
                  {!isFriend(user._id) && (
                    <i className="fas fa-user-plus addfriend" onClick={() => handleAddFriend(user._id)}></i>
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
