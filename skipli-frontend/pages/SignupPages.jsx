/* eslint-disable no-unused-vars */
import AuthForm from "../components/AuthForm";
import { signup } from "../api/auth";

export default function SignupPage() {
  // handle sign up
  const handleSignup = async (data) => {
    try {
      const res = await signup(data);
      alert(
        "Signup successful! You can now sign in."
      );
    } catch (err) {
      alert("Signup failed");
      console.error(err);
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      onSubmit={handleSignup}
    />
  );
}
