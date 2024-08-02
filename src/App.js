import React, { useState, useEffect } from "react";
import "./App.css";

const Card = ({
  index,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSave,
  isLoading,
}) => {
  return (
    <div className="card">
      <input
  type="text"
  className="name"
  value={name}
  onChange={(e) => onNameChange(index, e.target.value)}
  placeholder="Enter name"
  readOnly
  style={{ cursor: "default", border: "none", backgroundColor: "transparent" }}
/>
      <textarea
        className="description"
        value={description}
        onChange={(e) => onDescriptionChange(index, e.target.value)}
        placeholder="Enter work description"
      />
      <button
        className="save-button"
        onClick={() => onSave(index)}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loader"></span>
        ) : (
          <span className="tick-icon">✔</span>
        )}
      </button>
    </div>
  );
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() => {
    fetch("https://api-user-dashboard.vercel.app/cards")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  const handleSave = (index) => {
    setLoadingIndex(index);

    const card = cards[index];

    fetch(`https://api-user-dashboard.vercel.app/cards/${card._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    })
      .then((res) => res.json())
      .then((updatedCard) => {
        const updatedCards = [...cards];
        updatedCards[index] = updatedCard;
        setCards(updatedCards);
        setLoadingIndex(null);
        alert(`Card ${index + 1} saved!`);
      });
  };

  const handleNameChange = (index, newName) => {
    const updatedCards = [...cards];
    updatedCards[index].name = newName;
    setCards(updatedCards);
  };

  const handleDescriptionChange = (index, newDescription) => {
    const updatedCards = [...cards];
    updatedCards[index].description = newDescription;
    setCards(updatedCards);
  };

  return (
    <div className="app">
      <div className="grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            index={index}
            name={card.name}
            description={card.description}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
            onSave={handleSave}
            isLoading={loadingIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
