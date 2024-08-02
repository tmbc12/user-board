import React, { useState, useEffect } from 'react';
import './App.css';

const Card = ({ index, name, description, onNameChange, onDescriptionChange, onSave, isLoading }) => {
  return (
    <div className="card">
      <input
        type="text"
        className="name"
        value={name}
        onChange={(e) => onNameChange(index, e.target.value)}
        placeholder="Enter name"
      />
      <textarea
        className="description"
        value={description}
        onChange={(e) => onDescriptionChange(index, e.target.value)}
        placeholder="Enter work description"
      />
      <button className="save-button" onClick={() => onSave(index)} disabled={isLoading}>
        {isLoading ? (
          <span className="loader"></span>
        ) : (
          'Save'
        )}
      </button>
    </div>
  );
};

const App = () => {
  const initialData = [
    { name: 'Alice Johnson', description: 'Working on the marketing campaign for the upcoming product launch.' },
    { name: 'Bob Smith', description: 'Developing the new mobile app for our e-commerce platform.' },
    { name: 'Charlie Brown', description: 'Researching customer feedback to improve product features.' },
    { name: 'Diana Prince', description: 'Designing the new user interface for the website.' },
    { name: 'Ethan Hunt', description: 'Planning the next phase of the sales strategy.' },
    { name: 'Fiona Glenanne', description: 'Coordinating with the team for project deadlines and deliverables.' },
    { name: 'Grace Hopper', description: 'Analyzing data trends to optimize business performance.' },
    { name: 'Hank Schrader', description: 'Overseeing the production quality control processes.' },
    { name: 'Ivy League', description: 'Implementing innovative technology solutions.' },
  ];

  const [cards, setCards] = useState(initialData);
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  const handleSave = (index) => {
    setLoadingIndex(index); // Show the loader for the clicked button
    setTimeout(() => {
      const updatedCards = [...cards];
      localStorage.setItem('cards', JSON.stringify(updatedCards));
      setLoadingIndex(null); // Hide the loader after saving
      alert(`Card ${index + 1} saved!`);
    }, 1000); // Simulate a delay for saving
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
            isLoading={loadingIndex === index} // Pass the loading state to each card
          />
        ))}
      </div>
    </div>
  );
};

export default App;
