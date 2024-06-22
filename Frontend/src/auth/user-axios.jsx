import { Navigate } from "react-router-dom";
import useApiAxios from "../config/axios";

export const refreshUserQuery = async (setCurrentUser) => {
  console.log("refreshUser...");
  const url = window.location.pathname

  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await useApiAxios.get("/auth/refreshUser");
      const user = response.data?.user;
      console.log(url);
      setCurrentUser(user || null);
      if (url == '/login' || url == '/register') {
        window.location.href="/";
    } 
    } 
  } catch (error) {
    console.error("refreshUser failed:", error);
    localStorage.removeItem("token");

  }
};

export const logoutQuery = async (setCurrentUser) => {
    try{

        const response = await useApiAxios.post("/logout");
        window.location.href("/login");
    } catch (error) {
        console.error("logout failed:", error);
      }
        

  setCurrentUser(null);
  localStorage.removeItem("token");
  window.location.href="/login";

};