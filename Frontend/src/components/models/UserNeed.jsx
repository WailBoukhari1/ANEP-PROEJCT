import React, { useState, useContext } from "react";
import useApiAxios from "../../config/axios";
import UserContext from "../../auth/user-context";

const UserPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentUser] = useContext(UserContext);
  const [message, setMessage] = useState("");

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await useApiAxios.post("/user-needs", {
        user: currentUser,
        message: message,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      console.log("Success:", response.data);
      setShowForm(false);
      setMessage(""); // Clear the message after successful submission
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor" onClick={handleButtonClick}>Exprimer mon besoin</button>
      {showForm && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Exprimer mon besoin</h2>
            <form onSubmit={handleFormSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre besoin"
                required
              />
              <button type="submit">Envoyer</button>
              <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
