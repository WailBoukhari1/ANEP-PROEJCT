import { useState } from "react";
import useApiAxios from "../config/axios";

function Auth() {
  const [activeTab, setActiveTab] = useState("login"); // Default active tab
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    event.preventDefault();

    useApiAxios
      .post("auth/login", { email, password })
      .then((response) => {
        const token = response.data.user.tokenAccess;
        localStorage.setItem("token", token);
        const role = response.data.user.roles;
        const isAdmin = role.includes("admin");
        console.log(isAdmin);
        isAdmin
          ? (window.location.href = "/courses-admin")
          : (window.location.href = "/");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      {/* banner section */}
      <section>
        {/* banner section */}
        <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
          {/* animated icons */}
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
                Log In
              </h1>
              <ul className="flex gap-1 justify-center">
                <li>
                  <a
                    href="index.html"
                    className="text-lg text-blackColor2 dark:text-blackColor2-dark"
                  >
                    Home <i className="icofont-simple-right" />
                  </a>
                </li>
                <li>
                  <span className="text-lg text-blackColor2 dark:text-blackColor2-dark">
                    Log In
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/*form section */}
      <section className="relative">
        <div className="container py-100px">
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
                <span className="absolute w-full h-1 bg-primaryColor top-0 left-0 group-hover/btn:w-full" />
                Login
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
                Sing up
              </button>
            </div>
            {/*  tab contents */}
            <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px px-5 pb-10 md:p-50px md:pt-30px rounded-5px">
              <div className="tab-contents">
                {/* login form*/}
                {activeTab === "login" && (
                  <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                    {/* heading   */}
                    <div className="text-center">
                      <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                        Login
                      </h3>
                      <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                        Don&apos;t have an account yet?
                        <a
                          href="login.html"
                          className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
                        >
                          Sign up for free
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
                          placeholder="Your  email"
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                      </div>
                      <div className="mb-25px">
                        <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                          Password
                        </label>
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="Password"
                          className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                        />
                      </div>
                      <div className="text-contentColor dark:text-contentColor-dark flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="remember"
                            className="w-18px h-18px mr-2 block box-content"
                          />
                          <label htmlFor="remember"> Remember me</label>
                        </div>
                        <div>
                          <a
                            href="#"
                            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
                          >
                            Forgot your password?
                          </a>
                        </div>
                      </div>
                      <div className="my-25px text-center">
                        <button
                          onClick={handleSubmit}
                          type="submit"
                          className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                        >
                          Log in
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* sign up form*/}
                {activeTab === "signup" && (
                  <div className="block opacity-100 transition-opacity duration-150 ease-linear">
                    {/* heading   */}
                    <div className="text-center">
                      <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
                        Sing Up
                      </h3>
                      <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                        Already have an account?
                        <a
                          href="login.html"
                          className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
                        >
                          Log In
                        </a>
                      </p>
                    </div>
                    <form className="pt-25px" data-aos="fade-up">
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            First Name
                          </label>
                          <input
                            type="text"
                            placeholder="First Name"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Last Name
                          </label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Username
                          </label>
                          <input
                            type="text"
                            placeholder="Username"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Password
                          </label>
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
                          />
                        </div>
                        <div>
                          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                            Re-Enter Password
                          </label>
                          <input
                            type="password"
                            placeholder="Re-Enter Password"
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
                          Accept the Terms and Privacy Policy
                        </label>
                      </div>
                      <div className="mt-25px text-center">
                        <button
                          type="submit"
                          className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                        >
                          Log in
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