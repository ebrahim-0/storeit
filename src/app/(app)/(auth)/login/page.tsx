import AuthForm from "@/components/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StoreIt | Login",
  description: "StoreIt is a simple file storage service.",
};

const Login = () => {
  return <AuthForm type="login" />;
};

export default Login;
