import React, { useEffect, useState } from 'react';

const AdminPage = () => {
  const [userNeeds, setUserNeeds] = useState([]);

  useEffect(() => {
    fetch('/api/user-needs')
      .then(response => response.json())
      .then(data => setUserNeeds(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Besoins des utilisateurs</h1>
      <ul>
        {userNeeds.map((need) => (
          <li key={need._id}>
            <strong>{need.user.name}</strong> ({need.user.email}): {need.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
