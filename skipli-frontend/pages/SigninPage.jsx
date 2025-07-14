import AuthForm from "../components/AuthForm";
import { signin } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SigninPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] =
    useState("");

  const handleSignin = async (data) => {
    try {
      const res = await signin(data);
      const token = res.data.accessToken;

      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrorMessage(
        "Invalid email or password"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4">
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
            Sign In
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back! Please enter your
            credentials.
          </p>
        </div>

        {errorMessage && (
          <div className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 px-3 py-2 rounded text-sm text-center">
            {errorMessage}
          </div>
        )}

        <AuthForm
          mode="signin"
          onSubmit={handleSignin}
        />

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
