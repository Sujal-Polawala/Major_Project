import React, { createContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  isLoggedIn: false,
  user: null,
  token: null, // Add token here if you want to store it separately
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user, // Ensure you're setting user correctly
        token: action.payload.token, // Set token if needed
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null, // Also reset token if you are storing it
      };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On app load, check if user is stored in localStorage and set it in state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch({
          type: "LOGIN",
          payload: parsedUser, // Pass the full user data (including token)
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user"); // Clear invalid data
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
