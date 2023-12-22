import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { useMutation } from "@apollo/client";
import { REMOVE_ITEM, SEND_LIST } from "../utils/mutations";
import Modal from "../components/Modal";
import Edit from "../components/Edit";

const ListWork = () => {
  const { id, index } = useParams();
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { loading, error, data } = useQuery(QUERY_ME);

  const [selectedFriends, setSelectedFriends] = useState("");

  const [removeItem] = useMutation(REMOVE_ITEM, {
    variables: { itemId: "", listId: "" },
    refetchQueries: [{ query: QUERY_ME }],
  });

  const handleRemoveItem = async (itemId, listId) => {
    try {
      await removeItem({
        variables: { itemId: itemId, listId: listId },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const [sendList] = useMutation(SEND_LIST, {
    variables: { listId: "", recipientIds: [] },
    refetchQueries: [{ query: QUERY_ME }],
  });

  const handleSendList = async (listId) => {
    try {
      await sendList({
        variables: { listId: listId, recipientId: selectedFriends },
      });
      alert("List sent!");
      closeSendModal();
      // Clear selected friends when closing the modal
      setSelectedFriends("");
    } catch (e) {
      console.error(e);
      window.location.replace('/dashboard');
    }
  };

  const openSendModal = () => setIsSendOpen(true);
  const closeSendModal = () => {
    setIsSendOpen(false);
    setSelectedFriends("");
  };

  const handleToggleFriend = (friendId) => {
    setSelectedFriends(friendId);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error loading data</p>;
  }


  const openEditModal = () =>{
   setIsEditOpen(true);
  }
  const closeEditModal = () => setIsEditOpen(false);

  console.log("data",data?.me?.lists[index]);



  return (
    <div className="listWork">
      <h1>{data?.me?.lists[index]?.name}</h1>
      {data.me.lists[index].sentTo.length > 0 && (
        <p>
          Sent to: @{data.me.lists[index].sentTo.map((user) => user.username).join(", @")}
        </p>
      )}
      <ol className="item-list">
        {data?.me?.lists[index]?.items.map((item) => (
          <div key={item._id} className="list-item-group">
            <h3>{item.name}</h3>
            <p>{item.quantity}</p>
            {item.description && <p>{item.description}</p>}
            <h4
              onClick={() =>
                handleRemoveItem(item._id, data?.me?.lists[index]?._id)
              }
            >
              <i className="fa fa-trash deletebtn"></i>
            </h4>
          </div>
        ))}
      </ol>
      <div className="home-btns">
        <i className="fa-solid fa-paper-plane homebtn" onClick={openSendModal}></i>
        <i className="fa-solid fa-pen-to-square homebtn" onClick={openEditModal}></i>
      </div>
      <Modal isOpen={isSendOpen} closeModal={closeSendModal} className="modal-overlay">
        <div className="logoutModal">
        <h1>Send List</h1>
        <ul>
          <h2 className="sent-friends">Friends</h2>
          {data?.me?.friends.map((friend) => {
  // Check if the friend is not in the sentTo array of the specific list
  const isFriendNotInList = !data.me.lists[index].sentTo.some(sentToUser => sentToUser._id === friend._id);

  return isFriendNotInList ? (
    <li key={friend._id} className="check-list">
      <label className="friend-label">
        <input
          type="checkbox"
          checked={selectedFriends === friend._id}
          onChange={() => handleToggleFriend(friend._id)}
        />
        <p>{friend.username}</p>
      </label>
    </li>
  ) : null;
})}
        </ul>
        <button onClick={() => handleSendList(data?.me?.lists[index]?._id)}>
          Send
        </button>
        </div>
      </Modal>
      <Modal isOpen={isEditOpen} closeModal={closeEditModal}>
        <Edit data={data.me.lists[index]} />
      </Modal>
    </div>
  );
};

export default ListWork;
