import React, { useState } from 'react';

const UserNeedForm = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(message);

    // Envoyer le message à l'API backend
    try {
      const response = await fetch('https://anep-proejct.onrender.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      // Réinitialiser le message après l'envoi réussi
      setMessage('');
    } catch (error) {
      console.error('Erreur:', error);
    }
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