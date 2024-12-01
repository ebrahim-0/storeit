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
import { createAccount } from "@/lib/actions/user.action";

type TypeForm = "login" | "register";

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

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("🚀 ~ onSubmit ~ values", values);

    setIsLoading(true);

    setErrorMessage("");
    try {
      const user = await createAccount({
        email: values.email,
        password: values.password,
        ...(type === "register" && { fullName: values.fullName }),
      });
      console.log("🚀 ~ onSubmit ~ user:", user);

      if (!user) {
        throw new Error("Failed to create an account");
      }

      setAccountId(user.accountId ?? "");
    } catch (error: any) {
      setErrorMessage(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[800px] w-full max-w-[560px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8"
        >
          <h1 className="h1 text-light-100 text-center md:text-left">
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
            className="bg-brand hover:bg-brand-100 transition-all rounded-[41px] button h-[41px]"
            type="submit"
            disabled={isLoading}
            // onClick={() => setIsLoading((prev) => !prev)}
          >
            {type === "login" ? "Login" : "Register"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                width={24}
                height={24}
                alt="Loader"
                className="animate-spin ml-2"
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
              className="text-brand ml-1 font-medium"
            >
              {type === "login" ? "Register" : "Login"}
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
