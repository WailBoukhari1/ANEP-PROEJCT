import { useState } from "react";
import useApiAxios from "../config/axios";
import { Link } from "react-router-dom";

function Auth() {
  const [activeTab, setActiveTab] = useState("login"); // Default active tab
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeEmail, setActiveEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors

    let formErrors = {};

    if (!email) {
      formErrors.email = "Email est requis";
    } else if (!validateEmail(email)) {
      formErrors.email = "Email n'est pas valide";
    }

    if (!password) {
      formErrors.password = "Mot de passe est requis";
    } else if (password.length < 8) {
      formErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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
        if (error.response && error.response.data.errors) {
          const backendErrors = error.response.data.errors.reduce((acc, curr) => {
            acc[curr.param] = curr.msg;
            return acc;
          }, {});
          setErrors(backendErrors);
        } else if (error.response && error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else {
          console.error(error);
        }
      });
  };

  const handleEmailVerification = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors

    if (!validateEmail(activeEmail)) {
      setErrors({ activeEmail: "Email n'est pas valide" });
      return;
    }

    try {
      const response = await useApiAxios.post("auth/emailverify", { email: activeEmail });
      if (response.data.message) {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const backendErrors = error.response.data.errors.reduce((acc, curr) => {
          acc[curr.param] = curr.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else if (error.response && error.response.data.message) {
        setErrors({ general: error.response.data.message });
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      {/*form section */}
      <section className="relative">
        <div className="container py-100px flex">
          <div className="hidden md:block w-1/3"></div>
          <div className="tab md:w-2/3 mx-auto">
            {/* tab controller */}
            <div className="tab-links grid grid-cols-2 gap-11px text-blackColor text-lg lg:text-size-22 font-semibold font-hind mb-43px mt-30px md:mt-0">
              <button
                className={`py-9px lg:py-6 ${
                  activeTab === "login"
                    ? "text-primaryColor bg-white"
                    : "hover:text-primaryColor dark:text-whiteColor dark:hover:text-primaryColor bg-lightGrey7 dark:bg-lightGrey7-dark hover:bg-white dark:hover:bg-whiteColor-dark"
                } relative group/btn shadow-bottom hover:shadow-bottom dark:shadow-standard-dark disabled:cursor-pointer rounded-standard`}
                onClick={() => setActiveTab("login")}
              >
                <span
                  className={`${
                    activeTab === "login"
                      ? "absolute w-full h-1 bg-primaryColor top-0 left-0"
                      : "absolute w-0 h-1 bg-primaryColor top-0 left-0 group-hover/btn:w-full"
                  }`}
                />
                Se Connecter
              </button>
              <button
                className={`py-9px lg:py-6 ${
                  activeTab === "signup"
                    ? "text-primaryColor bg-white"
                    : "hover:text-primaryColor dark:hover:text-primaryColor dark:text-whiteColor bg-lightGrey7 dark:bg-lightGrey7-dark hover:bg-white dark:hover:bg-whiteColor-dark"
                } relative group/btn hover:shadow-bottom dark:shadow-standard-dark disabled:cursor-pointer rounded-standard`}
                onClick={() => setActiveTab("signup")}
              >
                <span
                  className={`${
                    activeTab === "signup"
                      ? "absolute w-full h-1 bg-primaryColor top-0 left-0"
                      : "absolute w-0 h-1 bg-primaryColor top-0 left-0 group-hover/btn:w-full"
                  }`}
                />
                Activez Votre Compte
              </button>
            </div>
            <div className="tab-descriptions text-center mb-5">
              {activeTab === "login" && (
                <p>Connectez-vous pour accéder à votre compte.</p>
              )}
              {activeTab === "signup" && (
                <p>Activez votre compte pour commencer à utiliser nos services.</p>
              )}
            </div>
            {/* tab contents */}
            <div className="flex shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px px-5 pb-10 md:p-50px md:pt-30px rounded-5px">
              <div>
                <img
                  src="assets/images/anep_login.png"
                  alt="Login Image"
                  className="w-full"
                />
              </div>

              <div className="tab-contents">
                {/* login form*/}
                {activeTab === "login" && (
                  <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                    {/* heading */}
                    <div className="text-center">
                      <img
                        src="assets/images/logo/logo_2.jpg"
                        alt="Logo"
                        className="mx-auto mb-4"
                      />
                      <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal"></h3>
                    </div>
                    <form className="pt-25px" data-aos="fade-up" onSubmit={handleSubmit}>
                      <div className="mb-25px">
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                          Email
                        </label>
                        <input
                          type="text"
                          placeholder="exemple : x.xxxxx@anep.ma"
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                        {errors.email && (
                          <p className="error-message">{errors.email}</p>
                        )}
                      </div>
                      <div className="mb-25px">
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                          Mot de passe
                        </label>
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="Password"
                          className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                        {errors.password && (
                          <p className="error-message">{errors.password}</p>
                        )}
                      </div>
                      {errors.general && (
                        <p className="error-message">{errors.general}</p>
                      )}
                      <div className="text-contentColor dark:text-contentColor-dark flex items-center justify-between">
                        <div className="flex items-center"></div>
                        <div>
                          <Link
                            to="ForgetPassword"
                            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
                          >
                            Vous avez oublié votre mot de passe ?
                          </Link>
                        </div>
                      </div>
                      <div className="my-25px">
                        <button
                          type="submit"
                          className="w-full bg-primaryColor text-whiteColor text-sm font-medium h-52px leading-52px rounded-md hover:opacity-90 transition-all"
                        >
                          Connexion
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* signup form */}
                {activeTab === "signup" && (
                  <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                    {/* heading */}
                    <div className="text-center">
                      <img
                        src="assets/images/logo/logo_2.jpg"
                        alt="Logo"
                        className="mx-auto mb-4"
                      />
                      <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal"></h3>
                    </div>
                    <form
                      className="pt-25px"
                      data-aos="fade-up"
                      onSubmit={handleEmailVerification}
                    >
                      <div className="mb-25px">
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                          Email
                        </label>
                        <input
                          type="text"
                          placeholder="exemple : x.xxxxx@anep.ma"
                          onChange={(e) => setActiveEmail(e.target.value)}
                          className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                        {errors.activeEmail && (
                          <p className="error-message">{errors.activeEmail}</p>
                        )}
                      </div>
                      {errors.general && (
                        <p className="error-message">{errors.general}</p>
                      )}
                      <div className="my-25px">
                        <button
                          type="submit"
                          className="w-full bg-primaryColor text-whiteColor text-sm font-medium h-52px leading-52px rounded-md hover:opacity-90 transition-all"
                        >
                          Activez votre compte
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
