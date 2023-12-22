import React, { useState } from "react";
import ProfileNav from "../components/ProfileNav";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME, QUERY_USERS } from "../utils/queries";
import { ADD_FRIEND } from "../utils/mutations";

const Friends = () => {
  // Fetching data using useQuery
  const { loading, error, data } = useQuery(QUERY_ME);
  const { loading: loadingUsers, data: dataUsers } = useQuery(QUERY_USERS);

  const [searchQuery, setSearchQuery] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  // Mutation hook for adding a friend
  const [addFriendMutation] = useMutation(ADD_FRIEND);

  if (loading || loadingUsers) return <p>Loading...</p>;
  // if (error || errorUsers) return <p>Error: {error?.message || errorUsers?.message}</p>;

  const { me } = data;

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? dataUsers.users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        refetchQueries: [{ query: QUERY_ME }], // Refetch the user data after adding a friend
      });
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error("Error adding friend:", error.message);
      window.location.reload();
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
              <li>@{friend.username}</li>
              {/* Add other friend details as needed */}
            </ul>
          ))}
        </div>
        <div className="current-friends">
          <h2>Search Friends</h2>
          <form>
            <input
              type="text"
              placeholder="Search for a friend"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHasInteracted(true); // Set hasInteracted to true on input change
              }}
            />
            <button type="submit">Search</button>
          </form>
          {/* Display filtered users only if there is text in the search query */}
          {hasInteracted && searchQuery && (
            <ul className="search-results">
              {filteredUsers.map((user) => (
                <li key={user._id}>
                  @{user.username} ({user.email})
                  {!isFriend(user._id) && (
                    <button onClick={() => handleAddFriend(user._id)}>+</button>
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