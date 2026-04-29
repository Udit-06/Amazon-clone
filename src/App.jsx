import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Header from "./Header";
import Login from "./Login";
import Checkout from "./Checkout";
import Payment from "./Payment";
import Orders from "./Orders";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useStateValue } from "./StateProvider";

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <Routes>

          {/* Login page (no header) */}
          <Route path="/login" element={<Login />} />

          {/* Checkout */}
          <Route path="/checkout" element={
            <>
              <Header />
              <Checkout />
            </>
          } />

          {/* Payment */}
          <Route path="/payment" element={
            <>
              <Header />
              <Payment />
            </>
          } />

          {/* Orders */}
          <Route path="/orders" element={
            <>
              <Header />
              <Orders />
            </>
          } />

          {/* Home */}
          <Route path="/" element={
            <>
              <Header />
              <Home />
            </>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;