import AuthForm from "../components/AuthForm";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const handleSignup = async (data) => {
    try {
      await signup(data);
      setSuccessMessage(
        "Signup successful! You can now sign in."
      );
      setErrorMessage("");

      setTimeout(() => {
        navigate("/signin");
      }, 1500); // Delay to show success
    } catch (err) {
      setSuccessMessage("");
      setErrorMessage(
        "Signup failed. Please check your info."
      );
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Sign Up
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Create a new account to get started
          </p>
        </div>

        {errorMessage && (
          <div className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 px-3 py-2 rounded text-sm text-center">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-3 py-2 rounded text-sm text-center">
            {successMessage}
          </div>
        )}

        <AuthForm
          mode="signup"
          onSubmit={handleSignup}
        />

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
