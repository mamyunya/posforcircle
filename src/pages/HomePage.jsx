import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import HomePage from "./HomePage";
import SalesPage from "./SalesPage";
import RegisterPage from "./RegisterPage";
import PaymentPage from "./PaymentPage";

export default function App() {
  return (
    <Router>
      <div className="navbar">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
          end
        >
          購入画面
        </NavLink>
        <NavLink
          to="/sales"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          売上履歴
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          商品登録
        </NavLink>
      </div>

      <div className="contents">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}