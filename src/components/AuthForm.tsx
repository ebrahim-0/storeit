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

export type TypeForm = "login" | "register";

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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[800px] w-full max-w-[560px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8"
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

          <Button className="btn" type="submit" disabled={isLoading}>
            {type === "login" ? "Login" : "Register"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                width={24}
                height={24}
                alt="Loader"
                className="ml-2 animate-spin"
              />
            )}
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

          <Button className="btn body-1 flex justify-center"
            onClick={() => {
              signUpWithGithub();
            }}
          >
            login with github Button
          </Button>
        </form>
      </Form>

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
