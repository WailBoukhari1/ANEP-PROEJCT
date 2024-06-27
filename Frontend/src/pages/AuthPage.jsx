import { useState } from "react";
import useApiAxios from "../config/axios";

function Auth() {
  const [activeTab, setActiveTab] = useState("login"); // Onglet actif par défaut
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const validate = () => {
    let valid = true;
    let errors = { email: "", password: "", general: "" };

    if (!email) {
      errors.email = "L'email est requis";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "L'adresse email est invalide";
      valid = false;
    }

    if (!password) {
      errors.password = "Le mot de passe est requis";
      valid = false;
    } else if (password.length < 6) {
      errors.password = "Le mot de passe doit comporter au moins 6 caractères";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    useApiAxios
      .post("auth/login", { email, password })
      .then((response) => {
        const token = response.data.user.tokenAccess;
        localStorage.setItem("token", token);
        const role = response.data.user.roles;
        const isAdmin = role.includes("admin");
        console.log(isAdmin);
        isAdmin
          ? (window.location.href = "/Dashboard")
          : (window.location.href = "/");
      })
      .catch((error) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Email ou mot de passe incorrect",
        }));
        console.error(error);
      });
  };

  return (
    <>
      {/* section bannière */}
      <section>
        {/* section bannière */}
        <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
          {/* icônes animées */}
          <div>
            <img
              className="absolute left-0 bottom-0 md:left-[14px] lg:left-[50px] lg:bottom-[21px] 2xl:left-[165px] 2xl:bottom-[60px] animate-move-var z-10"
              src="assets/images/herobanner/herobanner__1.png"
              alt=""
            />
            <img
              className="absolute left-0 top-0 lg:left-[50px] lg:top-[100px] animate-spin-slow"
              src="assets/images/herobanner/herobanner__2.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-0 md:right-10 lg:right-[575px] 2xl:top-20 animate-move-var2 opacity-50 hidden md:block"
              src="assets/images/herobanner/herobanner__3.png"
              alt=""
            />
            <img
              className="absolute right-[30px] top-[212px] md:right-10 md:top-[157px] lg:right-[45px] lg:top-[100px] animate-move-hor"
              src="assets/images/herobanner/herobanner__5.png"
              alt=""
            />
          </div>
          <div className="container">
            <div className="text-center">
              <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                Connexion
              </h1>
              <ul className="flex gap-1 justify-center">
                <li>
                  <a
                    href="index.html"
                    className="text-lg text-blackColor2 dark:text-blackColor2-dark"
                  >
                    Accueil <i className="icofont-simple-right" />
                  </a>
                </li>
                <li>
                  <span className="text-lg text-blackColor2 dark:text-blackColor2-dark">
                    Connexion
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* section formulaire */}
      <section className="relative">
        <div className="container py-100px">
          <div className="tab md:w-2/3 mx-auto">
            {/* contrôleur d'onglet */}
            <div className="tab-links grid grid-cols-2 gap-11px text-blackColor text-lg lg:text-size-22 font-semibold font-hind mb-43px mt-30px md:mt-0">
              <button
                className={`py-9px lg:py-6 ${
                  activeTab === "login"
                    ? "text-primaryColor bg-white"
                    : "hover:text-primaryColor dark:text-whiteColor dark:hover:text-primaryColor bg-lightGrey7 dark:bg-lightGrey7-dark hover:bg-white dark:hover:bg-whiteColor-dark"
                } relative group/btn shadow-bottom hover:shadow-bottom dark:shadow-standard-dark disabled:cursor-pointer rounded-standard`}
                onClick={() => setActiveTab("login")}
              >
                <span className="absolute w-full h-1 bg-primaryColor top-0 left-0 group-hover/btn:w-full" />
                Connexion
              </button>
              <button
                className={`py-9px lg:py-6 ${
                  activeTab === "signup"
                    ? "text-primaryColor bg-white"
                    : "hover:text-primaryColor dark:hover:text-primaryColor dark:text-whiteColor bg-lightGrey7 dark:bg-lightGrey7-dark hover:bg-white dark:hover:bg-whiteColor-dark"
                } relative group/btn hover:shadow-bottom dark:shadow-standard-dark disabled:cursor-pointer rounded-standard`}
                onClick={() => setActiveTab("signup")}
              >
                <span className="absolute w-0 h-1 bg-primaryColor top-0 left-0 group-hover/btn:w-full" />
                Inscription
              </button>
            </div>
            {/* contenus des onglets */}
            <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px px-5 pb-10 md:p-50px md:pt-30px rounded-5px">
              <div className="tab-contents">
                {/* formulaire de connexion */}
                {activeTab === "login" && (
                  <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                    {/* titre */}
                    <div className="text-center">
                      <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                        Connexion
                      </h3>
                      <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                        Vous n'avez pas encore de compte ?
                        <a
                          href="login.html"
                          className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
                        >
                          Inscrivez-vous gratuitement
                        </a>
                      </p>
                    </div>
                    <form className="pt-25px" data-aos="fade-up">
                      <div className="mb-25px">
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                          Email
                        </label>
                        <input
                          type="text"
                          placeholder="Votre email"
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                      </div>
                      <div className="mb-25px">
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                          Mot de passe
                        </label>
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="Mot de passe"
                          className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                        {errors.password && <div className="text-red-500">{errors.password}</div>}
                      </div>
                      <div className="text-contentColor dark:text-contentColor-dark flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="remember"
                            className="w-18px h-18px mr-2 block box-content"
                          />
                          <label htmlFor="remember"> Se souvenir de moi</label>
                        </div>
                        <div>
                          <a
                            href="#"
                            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
                          >
                            Mot de passe oublié ?
                          </a>
                        </div>
                      </div>
                      <div className="my-25px text-center">
                        <button
                          onClick={handleSubmit}
                          type="submit"
                          className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                        >
                          Se connecter
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* formulaire d'inscription */}
                {activeTab === "signup" && (
                  <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                    {/* titre */}
                    <div className="text-center">
                      <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                        Inscription
                      </h3>
                      <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                        Vous avez déjà un compte ?
                        <a
                          href="login.html"
                          className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
                        >
                          Se connecter
                        </a>
                      </p>
                    </div>
                    <form className="pt-25px" data-aos="fade-up">
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Prénom
                          </label>
                          <input
                            type="text"
                            placeholder="Prénom"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Nom
                          </label>
                          <input
                            type="text"
                            placeholder="Nom"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Nom d'utilisateur
                          </label>
                          <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="Votre Email"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Mot de passe
                          </label>
                          <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Répéter le mot de passe
                          </label>
                          <input
                            type="password"
                            placeholder="Répéter le mot de passe"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                      </div>
                      <div className="text-contentColor dark:text-contentColor-dark flex items-center">
                        <input
                          type="checkbox"
                          id="accept-pp"
                          className="w-18px h-18px mr-2 block box-content"
                        />
                        <label htmlFor="accept-pp">
                          Accepter les termes et la politique de confidentialité
                        </label>
                      </div>
                      <div className="mt-25px text-center">
                        <button
                          type="submit"
                          className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                        >
                          Se connecter
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Auth;