import React, { useEffect, useState } from "react";
import UserContext from "./user-context";
import { refreshUserQuery } from "./user-axios";


const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
 
  useEffect(() => {
   
    
    
    console.log("loaded");
    refreshUserQuery(setCurrentUser);
  }, [setCurrentUser]);
  
  return (
    <>
      <UserContext.Provider value={[currentUser, setCurrentUser]}>
        {children}
      </UserContext.Provider>
    </>
  )
;
};

export default UserProvider;