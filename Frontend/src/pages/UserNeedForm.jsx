import React, { useState } from 'react';

const UserNeedForm = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Exprimer votre besoin"
      />
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default UserNeedForm;
