import useApiAxios from "../config/axios";

export const refreshUserQuery = async (setCurrentUser) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await useApiAxios.get("/auth/refreshUser");
      const user = response.data?.user;
      setCurrentUser(user || null);
    } else {
      setCurrentUser(null);
    }
  } catch (error) {
    console.error("refreshUser failed:", error);
    localStorage.removeItem("token");
    setCurrentUser(null);
  }
};

export const logoutQuery = async (setCurrentUser) => {
  try {
    const response = await useApiAxios.post("/logout");
    console.log("Logout response:", response);
  } catch (error) {
    console.error("logout failed:", error);
  }

  setCurrentUser(null);
  localStorage.removeItem("token");
  window.location.href = "/login";
};
