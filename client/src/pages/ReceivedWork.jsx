import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ME, QUERY_USER } from "../utils/queries";
import { useMutation } from "@apollo/client";
import { REMOVE_ITEM } from "../utils/mutations";
import Modal from "../components/Modal";
import Edit from "../components/Edit";

const ReceivedWork = () => {
  const { index } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { loading, error, data } = useQuery(QUERY_ME);

  const [selectedFriends, setSelectedFriends] = useState("");
  const [removeItem] = useMutation(REMOVE_ITEM, {
    variables: { itemId: "", listId: "" },
    refetchQueries: [{ query: QUERY_ME }],
  });

  const { loading: userLoading, error: userError, data: userData } = useQuery(
    QUERY_USER,
    {
      variables: { userId: data?.me?.receivedLists[index]?.userId },
    }
  );

  const handleRemoveItem = async (itemId, listId) => {
    try {
      await removeItem({
        variables: { itemId: itemId, listId: listId },
      });
      alert("Item removed!");
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = () => {
    setIsEditOpen(true);
  };

  const closeEditModal = () => setIsEditOpen(false);

  const receivedList = data?.me?.receivedLists[index];
  const user = userData?.user;

  if (loading || userLoading) {
    return <p>Loading...</p>;
  }

  if (error || userError) {
    console.error(error || userError);
    return <p>Error loading data</p>;
  }

  return (
    <div className="listWork">
      <h1>{receivedList?.name}</h1>
      {user && <p>Sent by: {user?.username}</p>}
      <ol className="item-list">
        {receivedList?.items.map((item) => (
          <div key={item._id} className="list-item-group">
            <h3>{item.name}</h3>
            <p>{item.quantity}</p>
            {item.description && <p>{item.description}</p>}
            <h4
              onClick={() =>
                handleRemoveItem(item._id, receivedList?._id)
              }
            >
              <i className="fa fa-trash deletebtn"></i>
            </h4>
          </div>
        ))}
      </ol>
      <div className="home-btns">
        <i className="fa-solid fa-pen-to-square homebtn" onClick={openEditModal}></i>
      </div>
      <Modal isOpen={isEditOpen} closeModal={closeEditModal}>
        <Edit data={receivedList} />
      </Modal>
    </div>
  );
};

export default ReceivedWork;