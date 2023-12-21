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
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  // Assuming that data.me.lists contains an array of lists
  const lists = data.me.lists;

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
        {lists.map((list, index) => (
          <div key={list._id}>
            <Link className="list-link" to={`/dashboard/${list._id}/${index}`}>
              <li className="listRow">
                <span className="listName">{list.name}</span> | {list.dateCreated} | <span className="hidden">{index}</span> items: {list.items.length} |
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
