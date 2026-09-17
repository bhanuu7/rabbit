import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { fetchAuthSession } from "aws-amplify/auth";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState();
  const [role, setRole] = useState();
  async function fetchUser() {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens) {
        console.log("No active session");
        return;
      }
      const user = await getCurrentUser();
      const userData = user.signInDetails.loginId.split("@")[0];
      const userRole =
        session.tokens.accessToken.payload.scope.split("user.")[1];
      setUsername(userData);
      setRole(userRole);
    } catch (err) {
      console.error("fetchUser error:", err);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
