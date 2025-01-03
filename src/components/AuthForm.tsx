"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputController from "./InputController";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  createAccount,
  loginUser,
  signUpWithGithub,
} from "@/lib/actions/user.action";
import OtpModal from "./OtpModal";
import { toast } from "sonner";
import { Github } from "lucide-react";
import Icon from "./Icon";
import Text from "./ui/Text";

const authFormSchema = (type: TypeForm) => {
  return z.object({
    email: z.string().min(1, { message: "Email is required" }).email(),
    ...(type === "register" && {
      fullName: z.string().min(1, { message: "Full Name is required" }).max(50),
    }),
    password: z.string().min(1, { message: "Password is required" }).min(8),
  });
};

const AuthForm = ({ type }: { type: TypeForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState("");
  const [openOtp, setOpenOtp] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      setErrorMessage("");

      const user =
        type === "register"
          ? await createAccount({
              email: values.email,
              password: values.password,
              fullName: values.fullName,
            })
          : await loginUser({ email: values.email, password: values.password });

      if (user?.error) {
        throw new Error(user?.error?.message);
      }

      if (!user) {
        setIsLoading(false);
        throw new Error("Failed to create an account");
      }

      setAccountId(user?.accountId ?? "");
      setIsLoading(false);
      setOpenOtp(true);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error?.message);
      toast(error?.message, {
        className: "!bg-red !rounded-[10px]",
      });
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    signUpWithGithub()
      .then((res) => {
        console.log("🚀 ~ signUpWithGithub ~ res:", res);
        setIsGithubLoading(false);
      })
      .catch(() => {
        setIsGithubLoading(false);
      });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[800px] w-full max-w-[560px] flex-col justify-center space-y-6 transition-all lg:space-y-8"
        >
          <h1 className="h1 text-center text-light-100 md:text-left">
            {type === "login" ? "Login" : "Register"}
          </h1>

          {type === "register" && (
            <InputController
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="Enter your Full Name"
              defaultValue=""
            />
          )}

          <InputController
            control={form.control}
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your Email"
            defaultValue=""
          />

          <InputController
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your Password"
            type="password"
            defaultValue=""
          />

          <Button
            className="btn"
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {type === "login" ? "Login" : "Register"}
          </Button>

          {errorMessage && <p className="text-red">*{errorMessage}</p>}

          <div className="body-1 flex justify-center">
            <p className="text-light-100">
              {type === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <Link
              href={type === "login" ? "/register" : "/login"}
              className="ml-1 font-medium text-brand"
            >
              {type === "login" ? "Register" : "Login"}
            </Link>
          </div>
        </form>
      </Form>

      <Button
        className="btn mt-4 !bg-dark-100/80 transition-all duration-300 ease-in-out hover:!bg-light-100/80"
        type="button"
        onClick={handleGithubLogin}
        disabled={isGithubLoading}
        isLoading={isGithubLoading}
      >
        <Icon id="github-white" width={45} height={45} viewBox="0 0 98 98" />
        login with github
      </Button>

      {accountId && openOtp && (
        <OtpModal
          accountId={accountId}
          email={form.getValues("email")}
          isOpen={openOtp}
          setIsOpen={setOpenOtp}
        />
      )}
    </>
  );
};

export default AuthForm;
