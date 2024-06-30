import React, { useEffect, useState } from 'react';

const AdminPage = () => {
  const [userNeeds, setUserNeeds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/user-needs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUserNeeds(data))
      .catch(error => {
        console.error('Error:', error);
        setError('Failed to fetch user needs');
      });
  }, []);

  return (
    <div>
      <h1>Besoins des utilisateurs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {userNeeds.length > 0 ? (
          userNeeds.map((need) => (
            <li key={need._id}>
              <strong>{need.user.name}</strong> ({need.user.email}): {need.message}
            </li>
          ))
        ) : (
          <p>Aucun besoin d'utilisateur trouvé.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminPage;