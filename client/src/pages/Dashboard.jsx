import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REMOVE_LIST } from "../utils/mutations";
import ProfileNav from "../components/ProfileNav";

const Dashboard = () => {
  // Use the useQuery hook to fetch data
  const { loading, error, data } = useQuery(QUERY_ME);
  const [removeList] = useMutation(REMOVE_LIST, {
    variables: { listId: "" },
    refetchQueries: [{ query: QUERY_ME }],
  });

  if (loading) {
    return <div class="loader"></div>;
  }

  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  // Assuming that data.me.lists contains an array of lists
  const lists = data.me.lists;

  // Sort the lists based on the dateCreated property
  const sortedLists = [...lists].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

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

  console.log(sortedLists);

  return (
    <div className="dashboard">
      <ProfileNav />
      <ul className="listSection">
        {sortedLists.map((list, index) => (
          <div key={list._id}>
            <Link className="list-link" to={`/dashboard/${list._id}/${index}`}>
              <li className="listRow">
                <span className="listName">{list.name}</span> | {list.dateCreated} | items: {list.items.length} 
                {list.sentTo && list.sentTo.length > 0 && (
                  <span className="sentTo">Sent to: @{list.sentTo.map(user => user.username).join(', @')}</span>
                )}
                <i className="fa fa-trash deletebtn" onClick={(event) => handleRemoveList(event, list._id)}></i>
              </li>
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
