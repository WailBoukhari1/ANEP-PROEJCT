  import React, { useState, useContext } from "react";
  import useApiAxios from "../config/axios";
  import UserContext from "../auth/user-context";
  import MainLayout from "../layout/MainLayout";

  const UserNeedsPage = () => {
    const [currentUser] = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [submitStatus, setSubmitStatus] = useState(null); // State for submit status message

    const handleFormSubmit = async (event) => {
      event.preventDefault();

      try {
        const response = await useApiAxios.post(
          "/user-needs",
          {
            user: currentUser,
            title: title,
            message: message,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Success:", response.data);
        setSubmitStatus("success"); // Set success message
        setTitle("");
        setMessage("");
      } catch (error) {
        console.error("Error:", error);
        setSubmitStatus("error"); // Set error message
      }
    };

    return (
      <MainLayout>
        {/* Banner section */}
        <section className="banner-section">
          <div className="container">
            <div className="text-center">
              <h1 className="banner-title">
                Exprimer Un Besoin
              </h1>
              <ul className="breadcrumb">
                <li>
                  <a href="/" className="breadcrumb-link">Accueil <i className="icofont-simple-right" /></a>
                </li>
                <li>
                  <span className="breadcrumb-text">Exprimer Un Besoin</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* User needs form section */}
        <section className="form-section">
          <div className="container">
            <div className="form-container">
              {submitStatus === "success" && (
                <div className="flash-message success">Votre besoin a été envoyé avec succès.</div>
              )}
              {submitStatus === "error" && (
                <div className="flash-message error">Une erreur s'est produite lors de l'envoi du besoin.</div>
              )}
              <form onSubmit={handleFormSubmit} className="needs-form">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de votre besoin"
                  required
                  className="form-input title-input"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre besoin"
                  required
                  className="form-input message-textarea"
                />
                <div className="form-buttons">
                  <button type="submit" className="submit-button">Envoyer</button>
                  <button type="button" className="cancel-button" onClick={() => { setTitle(""); setMessage(""); }}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  };

  export default UserNeedsPage;
