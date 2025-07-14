/* eslint-disable no-unused-vars */
import AuthForm from "../components/AuthForm";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SignupPage() {
  const navigate = useNavigate();
  // handle sign up
  const handleSignup = async (data) => {
    try {
      const res = await signup(data);
      alert(
        "Signup successful! You can now sign in."
      );
      navigate("/signin");
    } catch (err) {
      alert("Signup failed");
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true }); // block back button and navigate
    }
  }, [navigate]);

  return (
    <AuthForm
      title="Sign Up"
      mode="signup"
      onSubmit={handleSignup}
    />
  );
}
