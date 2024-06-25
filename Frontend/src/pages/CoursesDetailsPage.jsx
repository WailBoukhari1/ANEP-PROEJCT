import MainLayout from "../layout/MainLayout";
import { useEffect, useState, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import FeedbackModal from "../components/models/FeedbackModel";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function CoursesDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [files, setFiles] = useState([]);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useContext(UserContext); // Ensure currentUser is declared and initialized before use
  const userId = currentUser._id;
  const baseURL = "http://localhost:5000";
  const socket = io("http://localhost:5000");

  useEffect(() => {
    useApiAxios
      .get(`/courses/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch course details. Status code: ${response.status}`
          );
        }
        return response.data;
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleShowEvaluationModal = () => {
    setShowEvaluationModal(true);
  };
  const handleJoinRequest = () => {
    if (!currentUser || !currentUser._id) {
      alert("User not logged in.");
      return;
    }

    useApiAxios
      .post(`http://localhost:5000/courses/${id}/request-join`, {
        userId: currentUser._id,
      })
      .then((response) => {
        alert("Request to join sent successfully!");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error sending join request:", error);
        alert("Failed to send join request.");
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]); // Assuming single file upload

      useApiAxios
        .post(`http://localhost:5000/courses/${id}/resources`, formData)
        .then((response) => {
          setFiles(response.data); // Assuming the backend returns the updated list of files
        })
        .catch((error) => console.error("Error uploading file:", error));
    },
  });

  useEffect(() => {
    useApiAxios
      .get(`http://localhost:5000/courses/${id}/resources`)
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => console.error("Failed to load files:", error));
  }, [id]);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim()) {
      fetch(`http://localhost:5000/courses/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: "Placeholder User",
          text: newComment,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setComments(data);
          setNewComment("");
          setFeedbackMessage("Comment added successfully!");
          setTimeout(() => setFeedbackMessage(""), 3000);
        })
        .catch((error) => {
          console.error("Failed to submit comment:", error);
          setFeedbackMessage("Failed to submit comment.");
          setTimeout(() => setFeedbackMessage(""), 3000);
        });
    } else {
      setFeedbackMessage("Please enter a valid comment.");
      setTimeout(() => setFeedbackMessage(""), 3000);
    }
  };

  const handleDeleteComment = (commentId) => {
    useApiAxios
      .delete(`http://localhost:5000/courses/${id}/comments/${commentId}`)
      .then((response) => {
        setComments(response.data); // Assuming the backend returns the updated list of comments
        setFeedbackMessage("Comment deleted successfully!");
        setTimeout(() => setFeedbackMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Failed to delete comment:", error);
        setFeedbackMessage("Failed to delete comment.");
        setTimeout(() => setFeedbackMessage(""), 3000);
      });
  };

  const handleReportComment = (commentId) => {
    if (!currentUser || !currentUser._id) {
      alert("User not logged in.");
      return;
    }

    useApiAxios
      .post(
        `http://localhost:5000/courses/${id}/comments/${commentId}/report`,
        {
          userId: currentUser._id,
        }
      )
      .then(() => {
        alert("Comment reported successfully!");
        socket.emit("commentReported", {
          courseId: id,
          commentId,
          courseName: course.title,
          commentText: comments.find((comment) => comment._id === commentId)
            .text,
        });
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.message ===
            "You have already reported this comment"
        ) {
          alert("You have already reported this comment.");
        } else {
          console.error("Failed to report comment:", error);
          alert("Failed to report comment.");
        }
      });
  };

  if (loading) return <MainLayout>Loading...</MainLayout>;
  if (error) return <MainLayout>Error: {error}</MainLayout>;
  return (
    <MainLayout>
      <>
        {/* banner section */}
        <section>
          <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
            <div className="container">
              <div className="text-center">
                <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor dark:text-blackColor-dark mb-7 md:mb-6 pt-3">
                  Course-Details
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
                      Course-Details
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/*course details section */}
        <section>
          <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
              <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
                {/* course 1 */}
                <div data-aos="fade-up">
                  {/* course thumbnail */}
                  <div className="overflow-hidden relative mb-5">
                    <img
                      src={`${baseURL}${course.imageUrl}`}
                      alt=""
                      className="w-full"
                    />
                  </div>
                  {/* course content */}
                  <div>
                    <div
                      className="flex items-center justify-between flex-wrap gap-6 mb-30px"
                      data-aos="fade-up"
                    >
                      <div>
                        <p className="text-sm text-contentColor dark:text-contentColor-dark font-medium">
                          Last Update:{" "}
                          <span className="text-blackColor dark:text-blackColor-dark">
                            {course.updatedAt}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* title */}
                    <h4
                      className="text-size-32 md:text-4xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-43px md:leading-14.5"
                      data-aos="fade-up"
                    >
                      {course.title}
                    </h4>
                    {/* course tab */}
                    <div data-aos="fade-up" className="tab course-details-tab">
                      <div className="tab-links flex flex-wrap md:flex-nowrap mb-30px rounded gap-0.5">
                        <button
                          onClick={() => handleTabClick("description")}
                          className={`relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                            activeTab === "description"
                              ? "bg-secondaryColor text-white"
                              : ""
                          }`}
                        >
                          <i className="icofont-paper mr-2" /> Description
                        </button>
                        <button
                          onClick={() => handleTabClick("reviews")}
                          className={`relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor  hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                            activeTab === "reviews"
                              ? "bg-primaryColor text-white"
                              : ""
                          }`}
                        >
                          <i className="icofont-star mr-2" /> Reviews
                        </button>
                        <button
                          onClick={() => handleTabClick("upload")}
                          className={`relative p-10px md:px-25px md:py-15px lg:py-3 2xl:py-15px 2xl:px-45px text-blackColor hover:bg-primaryColor hover:text-whiteColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor flex items-center ${
                            activeTab === "upload"
                              ? "bg-primaryColor text-white"
                              : ""
                          }`}
                        >
                          <i className="icofont-upload mr-2" /> Upload
                        </button>
                      </div>
                      <div className="tab-content">
                        {activeTab === "description" && (
                          <div>{course.description}</div>
                        )}
                        {activeTab === "reviews" && (
                          <div>
                            {/* client reviews */}
                            <div className="mt-60px mb-10">
                              <h4 className="text-lg text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-secondaryColor before:absolute before:bottom-[5px] before:left-0 leading-1.2 mb-25px">
                                Users Reviews
                              </h4>
                              <ul>
                                {comments.map((comment, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-30px pt-35px border-t border-borderColor2 dark:border-borderColor2-dark"
                                  >
                                    <div className="flex-grow">
                                      <div className="flex justify-between">
                                        <div>
                                          <h4>
                                            <a
                                              href="#"
                                              className="text-lg font-semibold text-blackColor hover:text-secondaryColor dark:text-blackColor-dark dark:hover:text-secondaryColor leading-1.2"
                                            >
                                              {comment.userName}{" "}
                                              {/* Display the userName from the comment */}
                                            </a>
                                          </h4>
                                        </div>
                                        <div className="author__icon">
                                          <p className="text-sm font-bold text-blackColor dark:text-blackColor-dark leading-9 px-25px mb-5px border-2 border-borderColor2 dark:border-borderColor2-dark hover:border-secondaryColor dark:hover:border-secondaryColor rounded-full transition-all duration-300">
                                            {new Date(
                                              comment.createdAt
                                            ).toLocaleDateString()}{" "}
                                            {/* Format the createdAt date */}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm text-contentColor dark:text-contentColor-dark leading-23px mb-15px">
                                        {comment.text}{" "}
                                        {/* Display the text of the comment */}
                                      </p>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() =>
                                            handleReportComment(comment._id)
                                          }
                                          className="bg-report-comment text-white px-4 py-2 rounded transition duration-300 flex items-center space-x-2"
                                        >
                                          <i className="fas fa-flag"></i>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteComment(comment._id)
                                          }
                                          className="bg-delete-comment text-white px-4 py-2 rounded transition duration-300 flex items-center space-x-2"
                                        >
                                          <i className="fas fa-trash-alt"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* add reviews */}
                            <div className="p-5 md:p-50px mb-50px bg-lightGrey12 dark:bg-transparent dark:shadow-brand-dark">
                              <h4
                                className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px !leading-1.2"
                                data-aos="fade-up"
                              >
                                Add a Review
                              </h4>
                              <form
                                className="pt-5"
                                data-aos="fade-up"
                                onSubmit={handleCommentSubmit}
                              >
                                <textarea
                                  placeholder="Type your comments...."
                                  className="w-full p-5 mb-8 bg-transparent text-sm text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border border-transparent dark:border-borderColor2-dark placeholder:text-placeholder"
                                  cols={30}
                                  rows={6}
                                  value={newComment}
                                  onChange={(e) =>
                                    setNewComment(e.target.value)
                                  }
                                />
                                <div className="mt-30px">
                                  <button
                                    type="submit"
                                    className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                                  >
                                    Submit
                                  </button>
                                </div>
                                {feedbackMessage && (
                                  <p className="text-sm mt-2">
                                    {feedbackMessage}
                                  </p>
                                )}
                              </form>
                            </div>
                          </div>
                        )}
                        {activeTab === "upload" && (
                          <div>
                            <div
                              {...getRootProps()}
                              className="dropzone p-6 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-gray-500"
                            >
                              <input {...getInputProps()} />
                              <p className="text-gray-700">
                                Drag &apos;n&apos; drop some files here, or
                                click to select files
                              </p>
                            </div>
                            <div className="file-list mt-4">
                              <h4 className="file-list-title text-lg font-semibold mb-2">
                                Files:
                              </h4>
                              <ul>
                                {files.map((file, index) => (
                                  <li
                                    key={index}
                                    className="flex justify-between items-center bg-white p-2 rounded-md shadow mb-2"
                                  >
                                    <div className="flex items-center">
                                      <span
                                        className={`file-icon ${file.type}-icon`}
                                      ></span>{" "}
                                      <span className="text-gray-800 text-sm ml-2">
                                        {file.title}
                                      </span>
                                    </div>
                                    <a
                                      href={`${baseURL}${file.link}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="download-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                      Download
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* course sidebar */}
              <div className="lg:col-start-9 lg:col-span-4">
                <div className="flex flex-col">
                  {/* enroll section */}
                  <div
                    className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md"
                    data-aos="fade-up"
                  >
                    {/* meeting thumbnail */}
                    <div className="overflow-hidden relative mb-5">
                      <img
                        src="assets/images/blog/blog_7.png"
                        alt=""
                        className="w-full"
                      />
                      <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10">
                        <div>
                          <button
                            data-url="https://www.youtube.com/watch?v=vHdclsdkp28"
                            className="lvideo relative w-15 h-15 md:h-20 md:w-20 lg:w-15 lg:h-15 2xl:h-70px 2xl:w-70px 3xl:h-20 3xl:w-20 bg-secondaryColor rounded-full flex items-center justify-center"
                          >
                            <span className="animate-buble absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full" />
                            <span className="animate-buble2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full" />
                            <img
                              loading="lazy"
                              src="assets/images/icon/video.png"
                              alt=""
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mb-5" data-aos="fade-up">
                      <div className="py-2">
                        <p className="text-lg font-semibold py-1">
                          Express you interset in joining
                        </p>
                        <button
                          type="submit"
                          onClick={handleJoinRequest}
                          className="w-full text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border mb-10px leading-1.8 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block  group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                        >
                          Request to join
                        </button>
                      </div>
                      <div className="py-2">
                        <p className="text-lg font-semibold py-1">
                          Did you finish the Course ? Leave you FeedBack
                        </p>
                        <button
                          onClick={handleShowEvaluationModal}
                          className="w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px mb-10px leading-1.8 border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark"
                        >
                          Feedback
                        </button>
                        <Dialog
                          open={showEvaluationModal}
                          onClose={() => setShowEvaluationModal(false)}
                        >
                          <DialogTitle>Evaluation</DialogTitle>
                          <DialogContent>
                            <FeedbackModal courseId={id} userId={userId} />
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => setShowEvaluationModal(false)}
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </MainLayout>
  );
}

export default CoursesDetails;
