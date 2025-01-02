import AuthForm from "@/components/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StoreIt | Register",
  description: "StoreIt is a simple file storage service.",
};

const Register = () => {
  return <AuthForm type="register" />;
};

export default Register;
