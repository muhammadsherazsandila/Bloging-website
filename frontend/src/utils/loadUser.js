import Cookie from "js-cookie";
import { backendServer } from "./backendServer";
/**
 * Function to load user data from the server and update the state.
 * @param {Function} setUser - Function to set the user state.
 * @param {Function} setIsLoggedIn - Function to set the login state.
 */
export const loadUser = async (setUser, setIsLoggedIn) => {
  try {
    const token = Cookie.get("token");
    if (token) {
      const response = await fetch(
        `${backendServer}/user/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load user data");
      }

      const data = await response.json();
      setUser(data.user);
      setIsLoggedIn(true);
    }
  } catch (error) {
    console.log("Error loading user:", error);
    setUser(null);
    setIsLoggedIn(false);
  }
};
