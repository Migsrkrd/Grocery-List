import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_USER } from "../utils/queries";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REMOVE_LIST } from "../utils/mutations";
import ProfileNav from "../components/ProfileNav";

const Received = () => {
  // Use the useQuery hook to fetch data
  const { loading, error, data } = useQuery(QUERY_ME);
  const [removeList] = useMutation(REMOVE_LIST, {
    variables: { listId: "" },
    refetchQueries: [{ query: QUERY_ME }],
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  // Assuming that data.me.receivedLists contains an array of received lists
  const receivedLists = data.me.receivedLists;

  // Sort the received lists based on the dateCreated property
  const sortedReceivedLists = [...receivedLists].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

  const handleRemoveList = async (event, listId) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await removeList({
        variables: { listId: listId },
      });
      alert("List removed!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard">
      <ProfileNav />
      <ul className="listSection">
        {sortedReceivedLists.length === 0 ? (
          <p>You do not have any received Lists yet!</p>
        ) : (
          sortedReceivedLists.map((list, index) => (
            <div key={list._id}>
              <Link className="list-link" to={`/received/${list._id}/${index}`}>
                <li className="listRow">
                  <span className="listName">{list.name}</span> | {list.dateCreated} | items: {list.items.length} |
                  {list.sentTo && list.sentTo.length > 0 && (
                    <span className="sentTo">
                      Sent to: @{list.sentTo.map((user) => user.username).join(", ")}
                    </span>
                  )}
                  {list.userId && (
                    <span className="listUser">
                      Sent by:{" "}
                      <QueryUserComponent userId={list.userId} />
                    </span>
                  )}
                  <i className="fa fa-trash deletebtn" onClick={(event) => handleRemoveList(event, list._id)}></i>
                </li>
              </Link>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default Received;

// New component to query user information based on userId
const QueryUserComponent = ({ userId }) => {
  const { loading, error, data } = useQuery(QUERY_USER, {
    variables: { userId },
  });

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    console.error(error);
    return <span>Error loading user data</span>;
  }

  return <span>{data.user.username}</span>;
};
