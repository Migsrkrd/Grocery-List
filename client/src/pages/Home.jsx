import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_ITEM, ADD_LIST } from '../utils/mutations'; // Replace with your actual file path

const Home = () => {
  const [items, setItems] = useState([]);
  const [listName, setListName] = useState('');

  // Mutation hooks
  const [addListMutation] = useMutation(ADD_LIST);
  const [addItemMutation] = useMutation(ADD_ITEM);

  const addInput = () => {
    const newItem = {
      name: `item ${items.length + 1}`,
      description: '',
      quantity: 1,
    };
    setItems([...items, newItem]);
  };
  

  const removeInput = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
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
    const { data: { addList: { _id: listId } } } = await addListMutation({
      variables: { name: listName },
    });

    // Step 2: Create items and associate them with the created list
    await Promise.all(items.map(async (item) => {
      await addItemMutation({
        variables: {
          listId,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
        },
      });
    }));

    // Optionally, you can reset the state or perform other actions after saving
    setListName('');
    setItems([]);
  };

  return (
    <div className="homePage">
      <div>
        <h3>Where to?</h3>
        <input type="text" value={listName} onChange={handleListNameChange} />
      </div>

      {items.map((item, index) => (
        <div key={index}>
          <p>{item.name}</p>
          <input type="text" />
          <input
            type="number"
            placeholder="#?"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
          />
          <button onClick={() => removeInput(index)}>Delete</button>
        </div>
      ))}

      <button onClick={addInput}>+</button>

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Home;
