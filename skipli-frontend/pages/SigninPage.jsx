import AuthForm from "../components/AuthForm";
import { signin } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SigninPage() {
  const navigate = useNavigate();

  const handleSignin = async (data) => {
    try {
      const res = await signin(data);
      const token = res.data.accessToken;

      // save token at local storage
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
      // after login success
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Signin failed");
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
      title="Sign In"
      mode="signin"
      onSubmit={handleSignin}
    />
  );
}
