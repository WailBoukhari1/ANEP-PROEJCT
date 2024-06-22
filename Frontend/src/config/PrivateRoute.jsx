import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../auth/user-context';

const PrivateRoute = ({ children }) => {
  const [currentUser] = useContext(UserContext);
  console.log(currentUser);

  if (!currentUser) {
    return <Navigate to="/Auth" />;
  }

  return children;
};

export default PrivateRoute;