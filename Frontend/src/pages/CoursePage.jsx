import MainLayout from "../layout/MainLayout";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useApiAxios from "../config/axios";

function Course() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState("dateDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "online", "offline"];

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await useApiAxios.get(`/courses`);
        const data = response.data;
        setCourses(data);
        setFilteredCourses(data); // Initially, no filter applied
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  const filterCourses = useCallback(
    (searchValue) => {
      let filtered = courses.filter(
        (course) =>
          (selectedCategory === "All" || course.offline === selectedCategory) &&
          (course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            course.description
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      );

      switch (sortOrder) {
        case "dateAsc":
          filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        case "dateDesc":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "titleAsc":
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "titleDesc":
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }

      setFilteredCourses(filtered);
    },
    [courses, sortOrder, selectedCategory]
  );

  useEffect(() => {
    filterCourses(searchTerm);
  }, [filterCourses, searchTerm, sortOrder, currentPage, selectedCategory]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    filterCourses(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate the number of pages
  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
  // Get current page of items
  const currentItems = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate the indices for displayed results
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = startIndex + currentItems.length - 1;
  const totalResults = filteredCourses.length;

  return (
    <MainLayout>
      <>
        {/* banner section */}
        <section>
          <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
            <div className="container">
              <div className="text-center">
                <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                  All Courses
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
                      All Courses
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* courses section */}
        <div>
          <div className="container tab py-10 md:py-50px lg:py-60px 2xl:py-100px">
            {/* courses header */}
            <div
              className="courses-header flex justify-between items-center flex-wrap px-13px py-10px border border-borderColor dark:border-borderColor-dark mb-30px gap-y-5"
              data-aos="fade-up"
            >
              <div>
                <p className="text-blackColor dark:text-blackColor-dark">
                  Showing {startIndex}–{endIndex} of {totalResults} Results
                </p>
              </div>
              <div className="flex items-center">
                <div className="pl-50px sm:pl-20 pr-10px">
                  <div className="basis-full lg:basis-[700px]">
                    <div className="category-filter">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`category-button ${
                            selectedCategory === category ? "active" : ""
                          }`}
                          onClick={() => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                          }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pl-50px sm:pl-20 pr-10px">
                  <select
                    className="text-blackColor bg-whiteColor py-3px pr-2 pl-3 rounded-md outline-none border-4 border-transparent focus:border-blue-light box-border"
                    value={sortOrder}
                    onChange={handleSortChange}
                  >
                    <option value="dateDesc">Date (Newest First)</option>
                    <option value="dateAsc">Date (Oldest First)</option>
                    <option value="titleAsc">Title (A-Z)</option>
                    <option value="titleDesc">Title (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-30px">
              {/* courses sidebar */}
              <div className="md:col-start-1 md:col-span-4 lg:col-span-3">
                <div className="flex flex-col">
                  {/* search input */}
                  <div
                    className="pt-30px pr-15px pl-10px pb-23px 2xl:pt-10 2xl:pr-25px 2xl:pl-5 2xl:pb-33px mb-30px border border-borderColor dark:border-borderColor-dark"
                    data-aos="fade-up"
                  >
                    <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold leading-30px mb-25px">
                      Search here
                    </h4>
                    <form className="w-full px-4 py-15px text-sm text-contentColor bg-lightGrey10 dark:bg-lightGrey10-dark dark:text-contentColor-dark flex justify-center items-center leading-26px">
                      <input
                        type="text"
                        placeholder="Search Produce"
                        className="placeholder:text-placeholder bg-transparent focus:outline-none placeholder:opacity-80 w-full"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <button type="submit">
                        <i className="icofont-search-1 text-base" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              {/* courses main */}
              <div className="md:col-start-5 md:col-span-8 lg:col-start-4 lg:col-span-9 space-y-[30px]">
                <div className="tab-contents">
                  {/* grid ordered cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-30px">
                    {currentItems.map((course, index) => (
                      <div key={index} className="group">
                        <div className="tab-content-wrapper" data-aos="fade-up">
                          <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
                            {/* card image */}
                            <div className="relative mb-4">
                              <Link to={`/CoursesDetails/${course._id}`}>
                                <img
                                  src={`${baseURL}${course.imageUrl}`}
                                  alt={course.title}
                                  className="w-full transition-all duration-300 group-hover:scale-110"
                                />
                              </Link>
                            </div>
                            {/* card content */}
                            <div>
                              <Link to={`/CoursesDetails/${course._id}`}>
                                {course.title}
                              </Link>
                              <div className="text-sm font-inter mb-4 description-clamp ">
                                {course.description}
                              </div>
                              <div className="text-xs py-5 text-gray-500">
                                Created on:{" "}
                                <span className="font-semibold">
                                  {course.createdAt}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* pagination */}
                <div className="pagination flex justify-center mt-4 space-x-2">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`pagination-button ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
}

export default Course;
