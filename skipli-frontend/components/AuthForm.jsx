import { useState } from "react";

export default function AuthForm({
  title,
  onSubmit,
  mode = "signin",
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data =
      mode === "signin"
        ? { email, verificationCode: code }
        : { email };

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
        {title}
      </h2>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your@email.com"
        />
      </div>

      {/* Code Field (only in Signin mode) */}
      {mode === "signin" && (
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Check your email"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
      >
        {mode === "signin"
          ? "Sign In"
          : "Sign Up"}
      </button>
    </form>
  );
}
