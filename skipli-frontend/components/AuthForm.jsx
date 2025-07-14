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
      className="max-w-sm mx-auto mt-10 space-y-4"
    >
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full px-3 py-2 border rounded"
        required
      />

      {mode === "signin" && (
        <input
          type="text"
          value={code}
          placeholder="Verification Code"
          onChange={(e) =>
            setCode(e.target.value)
          }
          className="w-full px-3 py-2 border rounded"
          required
        />
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
