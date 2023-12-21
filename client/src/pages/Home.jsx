import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_ITEM, ADD_LIST } from "../utils/mutations";

const Home = () => {
  const [items, setItems] = useState([]);
  const [listName, setListName] = useState("");

  // Mutation hooks
  const [addListMutation] = useMutation(ADD_LIST);
  const [addItemMutation] = useMutation(ADD_ITEM);

  const addInput = () => {
    const newItem = {
      name: "", // Set initially as an empty string
      description: "",
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  useEffect(() => {
    // Add at least one input row when the component mounts
    addInput();
  }, []);

  const removeInput = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleNameChange = (index, newName) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, name: newName } : item
    );
    setItems(updatedItems);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
  };

  const handleListNameChange = (e) => {
    setListName(e.target.value);
  };

  const handleSave = async () => {
    // Step 1: Create a list
    const {
      data: {
        addList: { _id: listId },
      },
    } = await addListMutation({
      variables: { name: listName },
    });

    // Step 2: Create items and associate them with the created list
    await Promise.all(
      items.map(async (item) => {
        await addItemMutation({
          variables: {
            listId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
          },
        });
      })
    );

    // Optionally, you can reset the state or perform other actions after saving
    setListName("");
    setItems([]);
    window.location.replace("/dashboard");
  };

  return (
    <div className="homePage">
      <div>
        <h3>Where to?</h3>
        <input type="text" value={listName} onChange={handleListNameChange} />
      </div>

      {items.map((item, index) => (
        <div key={index}>
          <p>Item {index + 1}</p>
          <input
            type="text"
            placeholder="Item name"
            value={item.name}
            onChange={(e) => handleNameChange(index, e.target.value)}
          />
          <input
            type="number"
            placeholder="#?"
            value={item.quantity}
            onChange={(e) =>
              handleQuantityChange(index, parseInt(e.target.value, 10))
            }
          />
          <input
            type="text"
            placeholder="Notes"
            value={item.description}
            onChange={(e) => {
              const updatedItems = items.map((item, i) =>
                i === index ? { ...item, description: e.target.value } : item
              );
              setItems(updatedItems);
            }}
          />
          <i
            onClick={() => removeInput(index)}
            className="fa fa-trash deletebtn"
          ></i>
        </div>
      ))}
      <div className="home-btns">
        <i onClick={addInput} className="fa-solid fa-plus homebtn"></i>
        <i className="fa-solid fa-circle-check homebtn" onClick={handleSave}></i>
      </div>
    </div>
  );
};

export default Home;
