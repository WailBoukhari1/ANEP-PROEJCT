import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target)
      ) {
        setIsNotificationMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      {/* navbar start */}
      <div className="transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark">
        <nav>
          <div className="py-15px lg:py-0 px-15px lg:container 3xl:container-secondary-lg 4xl:container mx-auto relative">
            <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-15px">
              {/* navbar left */}
              <div className="lg:col-start-1 lg:col-span-2">
                <Link to="/" className="block">
                  <img
                    src="/assets/images/logo/logo_1.png"
                    alt="Logo"
                    className="w-logo-sm lg:w-auto py-2"
                  />
                </Link>
              </div>
              {/* Main menu */}
              <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
                <ul className="nav-list flex justify-center space-x-8 lg:space-x-12">
                  <li className="nav-item">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/Courses"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Courses
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/CoursesDetails"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Courses Details
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/Dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/Auth"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Auth
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/UserCourses"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      User Courses
                    </NavLink>
                  </li>
                </ul>
              </div>
              {/* navbar right */}
              <div className="lg:col-start-10 lg:col-span-3">
                <ul className="relative nav-list flex justify-end items-center">
                  <li
                    onClick={toggleNotificationMenu}
                    className="px-5 lg:px-10px 2xl:px-5 lg:py-4 2xl:py-26px 3xl:py-9 group relative"
                  >
                    <Link className="relative block cursor-pointer">
                      <i className="icofont-notification text-2xl text-blackColor group-hover:text-secondaryColor transition-all duration-300 dark:text-blackColor-dark" />
                      <span className="absolute -top-1 2xl:-top-[5px] -right-[10px] lg:right-3/4 2xl:-right-[10px] text-[10px] font-medium text-white dark:text-whiteColor-dark bg-secondaryColor px-1 py-[2px] leading-1 rounded-full z-50 block">
                        3
                      </span>
                    </Link>
                    {isNotificationMenuOpen && (
                      <ul
                        ref={notificationMenuRef}
                        className="absolute right-0 bg-white text-gray-800 shadow-xl mt-2 rounded-md overflow-hidden z-50 w-72 border border-gray-200"
                      >
                        <li>
                          <Link
                            to="#notifications"
                            className="block px-6 py-3 text-sm hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            Notification 1
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#notifications"
                            className="block px-6 py-3 text-sm hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            Notification 2
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li
                    onClick={toggleUserMenu}
                    className="hidden lg:block relative"
                  >
                    <Link className="text-size-12 2xl:text-size-15 px-15px py-2 text-blackColor hover:text-whiteColor bg-whiteColor block hover:bg-primaryColor border border-borderColor1 rounded-standard font-semibold mr-[7px] 2xl:mr-15px dark:text-blackColor-dark dark:bg-whiteColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor dark:hover:border-primaryColor cursor-pointer">
                      <i className="icofont-user-alt-5" />
                    </Link>
                    {isUserMenuOpen && (
                      <ul
                        ref={userMenuRef}
                        className="absolute right-0 bg-white text-gray-800 shadow-xl mt-2 rounded-md overflow-hidden z-50 w-60 border border-gray-200"
                      >
                        <li>
                          <Link
                            to="/profile"
                            className="block px-6 py-3 text-sm hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/settings"
                            className="block px-6 py-3 text-sm hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            Settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/logout"
                            className="block px-6 py-3 text-sm hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="hidden lg:block">
                    <Link
                      to="#"
                      className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
                    >
                      Logout
                    </Link>
                  </li>
                  <li className="block lg:hidden">
                    <button
                      className="open-mobile-menu text-3xl text-darkdeep1 hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor lg:hidden"
                      onClick={toggleMobileMenu}
                    >
                      <i className="icofont-navigation-menu" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* navbar end */}
      {/* mobile menu */}
      <div
        className={`mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 ${
          isMobileMenuOpen ? "right-0" : "-right-full"
        } transition-all duration-500 h-full shadow-dropdown bg-white dark:bg-whiteColor-dark z-high lg:hidden`}
      >
        <button
          className="close-mobile-menu text-lg bg-darkdeep1 hover:bg-secondaryColor text-white px-[11px] py-[6px] absolute top-0 right-full"
          onClick={toggleMobileMenu}
        >
          <i className="icofont-close-line" />
        </button>
        {/* mobile menu wrapper */}
        <div className="px-5 md:px-30px pt-5 md:pt-10 pb-50px h-full overflow-y-auto">
          <ul>
            <li>
              <Link to="/" className="text-darkdeep1 hover:text-secondaryColor">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-darkdeep1 hover:text-secondaryColor"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-darkdeep1 hover:text-secondaryColor"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-darkdeep1 hover:text-secondaryColor"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
