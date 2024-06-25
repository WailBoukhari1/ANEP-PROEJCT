import MainLayout from "../layout/MainLayout";
import { useState, useEffect, useContext } from "react";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import { Link } from "react-router-dom";

function UserCourses() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [currentUser] = useContext(UserContext);
  const [courses, setCourses] = useState({
    ongoing: [],
    finished: [],
  });
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = currentUser._id;
        const response = await useApiAxios.get(`/courses/user/${userId}`);
        const fetchedCourses = response.data;

        const ongoingCourses = [];
        const finishedCourses = [];

        const currentDate = new Date();

        fetchedCourses.forEach((course) => {
          if (course.times && course.times.length > 0) {
            const startDate = new Date(course.times[0].startTime);
            const endDate = new Date(course.times[0].endTime);

            if (currentDate >= startDate && currentDate <= endDate) {
              ongoingCourses.push(course);
            } else if (currentDate > endDate) {
              finishedCourses.push(course);
            }
          }
        });

        setCourses({ ongoing: ongoingCourses, finished: finishedCourses });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [currentUser]);

  return (
    <MainLayout>
      <>
        {/* banner section */}
        <section>
          <div className="container-fluid-2 py-5">
            <div className="bg-primaryColor p-5 md:p-10 rounded-5 flex justify-center md:justify-between items-center flex-wrap gap-2">
              <div className="flex items-center flex-wrap justify-center sm:justify-start">
                <div className="mr-5"></div>
                <div className="text-whiteColor font-bold text-center sm:text-start">
                  <h5 className="text-xl leading-1.2 mb-5px">Hello</h5>
                  <h2 className="text-2xl leading-1.24">{currentUser.name}</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*dashbord menu section */}
        <section>
          <div className="container-fluid-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px pt-30px pb-100px">
              {/* dashboard content */}
              <div className="lg:col-start-12 lg:col-span-9">
                {/* courses area */}
                <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
                  {/* heading */}
                  <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
                    <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                      Course Status
                    </h2>
                  </div>
                  <div className="tab">
                    <div className="tab-links flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
                      <button
                        className={`relative py-10px px-5 md:py-15px lg:px-10 font-bold uppercase text-sm lg:text-base text-blackColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark before:w-0 before:h-0.5 before:absolute before:-bottom-0.5 lg:before:bottom-0 before:left-0 before:bg-primaryColor hover:before:w-full before:transition-all before:duration-300 whitespace-nowrap ${
                          activeTab === "ongoing"
                            ? "bg-primaryColor text-white"
                            : ""
                        }`}
                        onClick={() => setActiveTab("ongoing")}
                      >
                        On Going
                      </button>
                      <button
                        className={`relative py-10px px-5 md:py-15px lg:px-10 font-bold uppercase text-sm lg:text-base text-blackColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark before:w-0 before:h-0.5 before:absolute before:-bottom-0.5 lg:before:bottom-0 before:left-0 before:bg-primaryColor hover:before:w-full before:transition-all before:duration-300 whitespace-nowrap ${
                          activeTab === "finished"
                            ? "bg-primaryColor text-white"
                            : ""
                        }`}
                        onClick={() => setActiveTab("finished")}
                      >
                        Finished
                      </button>
                    </div>
                    <div className="tab-contents">
                      <div className="transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-30px">
                          {courses[activeTab].map((course) => (
                            <div key={course.id} className="group">
                              {/* card 2 */}
                              <div
                                className="tab-content-wrapper"
                                data-aos="fade-up"
                              >
                                <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
                                  {/* card image */}
                                  <div className="relative mb-4">
                                    <Link
                                      to={`/CoursesDetails/${course._id}`}
                                      className="w-full overflow-hidden rounded"
                                    >
                                      <img
                                        src={`${baseUrl}${course.imageUrl}`}
                                        alt=""
                                        className="w-full transition-all duration-300 group-hover:scale-110"
                                      />
                                    </Link>
                                  </div>
                                  {/* card content */}
                                  <div>
                                    <Link
                                      to={`/CoursesDetails/${course._id}`}
                                      className="text-xl font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor"
                                    >
                                      {course.title}
                                    </Link>
                                    <p>{course.description}</p>
                                    {/* author*/}
                                    <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
                                      <div>
                                        <a
                                          href="instructor-details.html"
                                          className="text-base font-bold font-hind flex items-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                                        >
                                          {course.instructor}
                                        </a>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm text-gray-500">
                                          {course.date}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* end card 2 */}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end courses area */}
              </div>
            </div>
          </div>
        </section>
      </>
    </MainLayout>
  );
}

export default UserCourses;
