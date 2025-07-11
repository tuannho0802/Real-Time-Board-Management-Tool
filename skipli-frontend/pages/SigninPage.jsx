import AuthForm from "../components/AuthForm";
import { signin } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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

      // redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      alert("Signin failed");
      console.error(err);
    }
  };

  return (
    <AuthForm
      title="Sign In"
      onSubmit={handleSignin}
    />
  );
}
