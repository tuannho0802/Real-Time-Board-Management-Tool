import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPages";
import SigninPage from "../pages/SigninPage";
import Dashboard from "../pages/Dashboard";

// auth step
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? (
    children
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/signup"
          element={<SignupPage />}
        />
        <Route
          path="/signin"
          element={<SigninPage />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
