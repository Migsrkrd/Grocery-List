import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_ITEM, ADD_LIST } from "../utils/mutations";
import Auth from "../utils/auth";

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
      {Auth.loggedIn() ? (
        <div className="homePage-content">
          <h3>Where to?</h3>
          <input
            type="text"
            value={listName}
            onChange={handleListNameChange}
            className="whereTo"
          />
          {items.map((item, index) => (
            <div key={index} className="inputs-Area">
              <p>Item {index + 1}</p>
              <input
                className="itemInput"
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
              <input
                className="quantityInput"
                type="number"
                placeholder="#?"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(index, parseInt(e.target.value, 10))
                }
              />
              <input
                className="notesInput"
                type="text"
                placeholder="Notes"
                value={item.description}
                onChange={(e) => {
                  const updatedItems = items.map((item, i) =>
                    i === index
                      ? { ...item, description: e.target.value }
                      : item
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
            <i
              className="fa-solid fa-circle-check homebtn"
              onClick={handleSave}
            ></i>
          </div>
        </div>
      ) : (
        <div className="home-info">
          <div id="welcome-section">
            <h1>Welcome to Grocease!</h1>
          </div>
          <div id="authentication-section">
            <h2>User Authentication:</h2>
            <p>
              The first step is to create an account by signing up or logging
              in. User authentication ensures a secure and personalized
              environment. Once logged in, you have access to a range of
              features tailored to your needs.
            </p>
          </div>
          <div id="create-lists-section">
            <h2>Create Shopping Lists:</h2>
            <p>
              Easily create personalized shopping lists for different occasions.
              Name your lists, making it convenient to organize and distinguish
              between various shopping requirements.
            </p>
          </div>
          <div id="item-management-section">
            <h2>Add, Edit, and Remove Items:</h2>
            <p>
              Customize your shopping lists by adding, editing, or removing
              items. Tailor each entry with details such as item name, quantity,
              and additional notes. This flexibility ensures that your lists
              accurately reflect your specific needs.
            </p>
          </div>
          <div id="friendship-section">
            <h2>Friendship Connections:</h2>
            <p>
              Connect with other users by adding them as friends within the app.
              This feature promotes a sense of community, making it easy to
              collaborate on shopping lists and share essential items.
            </p>
          </div>
          <div id="send-lists-section">
            <h2>Send Lists to Friends:</h2>
            <p>
              Enhance collaboration by sending your shopping lists directly to
              friends. This is especially useful for shared responsibilities,
              ensuring everyone is on the same page when it comes to purchasing
              items for a shared event or household.
            </p>
          </div>
          <div id="ui-section">
            <h2>Intuitive User Interface:</h2>
            <p>
              Our app boasts an intuitive user interface, making navigation a
              breeze. Whether you're a tech-savvy user or new to online list
              management, our design focuses on simplicity without compromising
              functionality.
            </p>
          </div>
          <div id="management-section">
            <h2>Effortless Item Management:</h2>
            <p>
              Efficiently manage your list items with our straightforward
              controls. Add new items with a single click, edit details
              seamlessly, and remove items you no longer need. The app adapts to
              your preferences, making it a valuable tool for all users.
            </p>
          </div>
          <div id="enjoy-section">
            <h2>Enjoy Shopping with Our App:</h2>
            <p>
              Experience the convenience of organized shopping with our app.
              From planning your lists to collaborating with friends, we're here
              to make your shopping experience enjoyable and stress-free.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
