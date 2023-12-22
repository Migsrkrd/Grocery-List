import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_ITEM, UPDATE_ITEM } from "../utils/mutations";
import { useParams } from "react-router-dom";

const Edit = (data) => {
  const ListData = data.data;
  const param = useParams();

  const [items, setItems] = useState(ListData.items);

  const [updateItem] = useMutation(UPDATE_ITEM);
  const [addItem] = useMutation(ADD_ITEM);

  const handleAddInputs = () => {
    setItems((prevItems) => {
      const newItem = {
        name: "new Item",
        description: "new item description",
        quantity: 1,
        isRemoved: false,
      };
      return [...prevItems, newItem];
    });
  };

  const handleRemoveInputs = (index) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isRemoved: true } : item
      ).filter((item) => !item.isRemoved)
    );
  };

  const handleSave = async () => {
    for (const item of items) {
      if (!item.isRemoved) {
        if (ListData.items.some((originalItem) => originalItem._id === item._id)) {
          await updateItem({
            variables: {
              itemId: item._id,
              name: item.name,
              description: item.description,
              quantity: parseInt(item.quantity),
            },
          });
        } else {
          await addItem({
            variables: {
              listId: ListData._id,
              name: item.name,
              description: item.description,
              quantity: parseInt(item.quantity),
            },
          });
        }
      }
    }
    window.location.assign(`/dashboard/${param.id}/${param.index}`);
  };

  return (
    <div>
      <h2>{ListData.name}</h2>
      <div className="list-item-group">
        <h3>Items</h3>
        <h3>Quantity</h3>
        <h3>Description</h3>
      </div>
      {items.map((item, index) => (
        <div key={index} className="list-item-group">
          {!item.isRemoved && (
            <>
              <input
                value={item.name}
                onChange={(e) => {
                  const updatedItems = [...items];
                  updatedItems[index] = { ...item, name: e.target.value };
                  setItems(updatedItems);
                }}
              />
              <input
                value={item.quantity}
                type="number"
                onChange={(e) => {
                  const updatedItems = [...items];
                  updatedItems[index] = { ...item, quantity: e.target.value };
                  setItems(updatedItems);
                }}
              />
              {!item.isRemoved && (
                <input
                  value={item.description}
                  onChange={(e) => {
                    const updatedItems = [...items];
                    updatedItems[index] = { ...item, description: e.target.value };
                    setItems(updatedItems);
                  }}
                />
              )}
              <h2 onClick={() => handleRemoveInputs(index)}><i className="fa fa-trash deletebtn"></i></h2>
            </>
          )}
        </div>
      ))}
      <div className="home-btns">
        <i className="fa-solid fa-plus homebtn" onClick={handleAddInputs}></i>
        <i className="fa-solid fa-circle-check homebtn" onClick={handleSave}></i>
      </div>
    </div>
  );
};

export default Edit;




