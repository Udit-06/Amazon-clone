import { createContext, useContext, useReducer } from "react";

// Prepares the dataLayer
// eslint-disable-next-line react-refresh/only-export-components
export const StateContext = createContext();

// Wrap our app and provide the Data layer
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Pull information from the data layer
// eslint-disable-next-line react-refresh/only-export-components
export const useStateValue = () => useContext(StateContext);