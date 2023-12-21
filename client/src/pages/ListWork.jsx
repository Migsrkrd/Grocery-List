import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { useMutation } from "@apollo/client";
import { REMOVE_ITEM } from "../utils/mutations";

const ListWork = () => {
  const { id } = useParams();
  const { index } = useParams();

  const { loading, error, data } = useQuery(QUERY_ME);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }

  const [removeItem] = useMutation(REMOVE_ITEM, {
    variables: { itemId: "", listId: "" },
    refetchQueries: [{ query: QUERY_ME }],
  });

  const handleRemoveItem = async (itemId, listId) => {
    console.log(itemId);
    try {
      await removeItem({
        variables: { itemId: itemId, listId: listId },
      });
      alert("Item removed!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="listWork">
      <h1>{data.me.lists[index].name}</h1>
      <ol className="item-list">
        {data.me.lists[index].items.map((item) => (
          <div key={item._id} className="list-item-group">
            <h3>{item.name}</h3>
            <p>{item.quantity}</p>
            {item.description && <p>{item.description}</p>}
            <h4
              onClick={() =>
                handleRemoveItem(item._id, data.me.lists[index]._id)
              }
            >
              <i className="fa fa-trash deletebtn"></i>
            </h4>
          </div>
        ))}
      </ol>
      <button>Send</button>
      <button>Edit</button>
    </div>
  );
};

export default ListWork;
