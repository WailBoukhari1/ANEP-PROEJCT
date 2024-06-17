import MainLayout from "../layout/MainLayout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
function HomePage() {
  const [cards, setCards] = useState([]);
  const [comments, setComments] = useState([]);

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch(`${baseURL}/courses`);
        const data = await response.json();
        const sortedCourses = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setCards(sortedCourses);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
      }
    }

    fetchCards();
  }, []);
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`${baseURL}/latest-comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }

    fetchComments();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: true,
  };
  return (
    <MainLayout>
      <>
        <>
          <section>
            <>
              {/* banner section */}
              <div className="hero bg-lightGrey11 bg-lightGrey11 relative z-0 overflow-hidden py-50px md:pt-70px md:pb-30">
                <div className="container 2xl:container-secondary-md relative">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-30px">
                    {/* banner Left */}
                    <div
                      data-aos="fade-up"
                      className="md:col-start-1 md:col-span-12 lg:col-start-1 lg:col-span-8"
                    >
                      <div className="3xl:pr-135px">
                        <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-[4px] font-semibold">
                          EDUCATION SOLUTION
                        </h3>
                        <h1 className="text-size-35 md:text-size-65 lg:text-5xl 2xl:text-size-65 leading-42px md:leading-18 lg:leading-15 2xl:leading-18 text-blackColor text-blackColor- md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold mb-15px">
                          Ignite Your{" "}
                          <span className="text-secondaryColor">Career</span>{" "}
                          with Learning the Largest{" "}
                          <span className="text-secondaryColor"> Online </span>{" "}
                          Platform.
                        </h1>
                        <p className="text-size-15md:text-lg text-blackColor text-blackColor- font-medium">
                          Lorem Ipsum is simply dummy text of the printing
                          <br />
                          typesetting industry. Lorem Ipsum has been
                        </p>
                        <div className="mt-30px">
                          <Link
                            to="/courses"
                            className="text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px hover:bg-whiteColor- hover:text-primaryColor"
                          >
                            View Courses
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* banner right */}
                  </div>
                </div>
              </div>
            </>
          </section>
          {/* courses section */}
          <section>
            <div className="pt-50px pb-10 md:pt-70px md:pb-50px lg:pt-20 2xl:pt-100px 2xl:pb-70px bg-whiteColor bg-whiteColor-">
              <div className="filter-container container">
                <div className="flex gap-15px lg:gap-30px flex-wrap lg:flex-nowrap items-center">
                  {/* courses Left */}
                  <div
                    className="basis-full lg:basis-[500px]"
                    data-aos="fade-up"
                  >
                    <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                      Course List
                    </span>
                    <h3
                      className="text-3xl md:text-[35px] lg:text-size-42 leading-[45px] 2xl:leading-[45px] md:leading-[50px] font-bold text-blackColor text-blackColor-"
                      data-aos="fade-up"
                    >
                      Lastest Course Added Just For You
                    </h3>
                  </div>
                  {/* courses right */}
                </div>
                {/* course cards */}
                <div
                  className="container p-0 filter-contents flex flex-wrap sm:-mx-15px mt-7 lg:mt-10"
                  data-aos="fade-up"
                >
                  {cards.length > 0 ? (
                    cards.map((card) => (
                      <div
                        key={card.id}
                        className="w-full sm:w-1/2 lg:w-1/3 group grid-item"
                      >
                        <div className="tab-content-wrapper sm:px-15px mb-30px">
                          <div className="p-15px bg-whiteColor shadow-brand">
                            {/* card image */}
                            <div className="relative mb-4">
                              <Link
                                to="#"
                                className="w-full overflow-hidden rounded"
                              >
                                <img
                                  src={`${baseURL}${card.imageUrl}`}
                                  alt={card.title || "Course Image"}
                                  className="w-full transition-all duration-300 group-hover:scale-110"
                                />
                              </Link>
                              <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                                <Link
                                  className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                                  to="#"
                                >
                                  <i className="icofont-heart-alt text-base py-1 px-2" />
                                </Link>
                              </div>
                            </div>
                            {/* card content */}
                            <div>
                              <Link
                                to="#"
                                className="text-xl font-semibold text-blackColor mb-10px font-hind text-blackColor- hover:text-primaryColor hover:text-primaryColor"
                              >
                                {card.title}
                              </Link>
                              {/* author and rating */}
                              <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
                                <div>
                                  <Link
                                    to="#"
                                    className="text-base font-bold font-hind flex items-center hover:text-primaryColor text-blackColor- hover:text-primaryColor"
                                  >
                                    <span className="flex">
                                      <p>{card.description}</p>
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No cards available.</div>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* testimonial section */}
          <section>
            <div className="bg-lightGrey10 bg-lightGrey10- relative z-0 overflow-hidden">
              <div className="container py-50px md:py-70px lg:py-20 2xl:pt-145px 2xl:pb-154px">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-30px lg:gap-0">
                  {/* testimonial Left */}
                  <div data-aos="fade-up">
                    <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-[4px] font-semibold">
                      EDUCATION SOLUTION
                    </h3>
                    <h1 className="text-3xl text-blackColor md:text-size-35 lg:text-size-42 2xl:text-size-47 leading-10 md:leading-45px lg:leading-12 2xl:leading-50px text-blackColor- font-bold mb-15px">
                      Client Testimonial About Our Lms Agency
                    </h1>
                    <Slider {...settings}>
                      {comments.map((comment, index) => (
                        <div key={index}>
                          <p className="text-lightGrey text-black">
                            <i className="icofont-quote-left text-primaryColor text-xl" />{" "}
                            {comment.text}{" "}
                            <i className="icofont-quote-right text-primaryColor text-xl" />
                          </p>
                          <div className="flex items-center pt-10">
                            <div>
                              <h4 className="text-size-22 font-semibold text-contentColor hover:text-primaryColor">
                                {comment.userName}
                              </h4>
                              {/* <Link to="#" className="text-primaryColor">
                                {comment.position}
                              </Link> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                  {/* testimonial right */}
                  <div data-aos="fade-up">
                    <div className="tilt pl-0 md:pl-70px">
                      <img
                        className="w-full"
                        src="/assets/images/testimonial/testi__group__1.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      </>
    </MainLayout>
  );
}

export default HomePage;
