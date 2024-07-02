import React, { useState, useContext } from "react";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import MainLayout from "../layout/MainLayout";

const UserNeedsPage = () => {
  const [currentUser] = useContext(UserContext);
  const [message, setMessage] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await useApiAxios.post(
        "/user-needs",
        {
          user: currentUser,
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      console.log("Success:", response.data);
      setMessage(""); // Clear the message after successful submission
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <MainLayout>
      {/* section de la bannière */}
      <section>
        <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
          <div className="container">
            <div className="text-center">
              <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                Exprimer Un Besoin
              </h1>
              <ul className="flex gap-1 justify-center">
                <li>
                  <a
                    href="/"
                    className="text-lg text-blackColor2 dark:text-blackColor2-dark"
                  >
                    Accueil <i className="icofont-simple-right" />
                  </a>
                </li>
                <li>
                  <span className="text-lg text-blackColor2 dark:text-blackColor2-dark">
                    Exprimer Un Besoin
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="user-page">
        <div className="form-container">
          <div className="form-inner">
            <h2>Exprimer mon besoin</h2>
            <form onSubmit={handleFormSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre besoin"
                required
                className="message-textarea"
              />
              <div className="form-buttons">
                <button type="submit" className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor">Envoyer</button>
                <button type="button" className="cancel-button" onClick={() => setMessage("")}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserNeedsPage;
