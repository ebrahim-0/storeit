"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { sendEmailOtp, verifyOtp } from "@/lib/actions/user.action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useDispatch } from "zustore";
import { toast } from "sonner";

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 characters" }),
});

const OtpModal = ({
  email,
  accountId,
  setIsOpen,
  isOpen,
}: {
  email: string;
  accountId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const maxLength = 6;
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const { dispatcher } = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const { error, ...sessionId } = await verifyOtp({
      accountId,
      otp: values.otp,
    });

    if (error) {
      form.setError("otp", { message: error.message });
      toast(error?.message, {
        className: "!bg-red !rounded-[10px]",
        duration: 1500,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    dispatcher("getLoginUser", {
      callback: () => {
        push("/");
      },
    });
  };

  const handleResend = async () => {
    setIsResend(true);
    const { error, ...resend } = await sendEmailOtp(email);

    if (error) {
      setIsResend(false);
      return;
    }

    setIsResend(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent
        className={cn(
          "max-w-[95%] space-y-4 px-[36px] py-[40px] sm:w-fit",
          "!rounded-xl bg-white outline-none md:!rounded-[30px]",
        )}
      >
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="Close"
              width={24}
              height={24}
              onClick={() => setIsOpen(false)}
              className="absolute -right-5 -top-7 cursor-pointer sm:-right-2 sm:-top-4"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We've sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={maxLength} autoFocus {...field}>
                        <InputOTPGroup className="flex w-full justify-between gap-1 sm:gap-2">
                          {Array.from({ length: maxLength }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={cn(
                                "size-12 text-[40px] font-medium md:size-16",
                                "!rounded-[12px] text-brand-100 ring-brand",
                                "justify-center shadow-drop-1",
                                "flex border-2 border-light-300",
                              )}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="body-2 ml-4" />
                  </FormItem>
                );
              }}
            />

            <AlertDialogFooter>
              <div className="flex w-full flex-col gap-4">
                <AlertDialogAction
                  onClick={form.handleSubmit(handleSubmit)}
                  className="btn"
                  disabled={isLoading}
                  type="submit"
                >
                  Submit
                  {isLoading && (
                    <Image
                      src="/assets/icons/loader.svg"
                      width={24}
                      height={24}
                      alt="Loader"
                      className="ml-2 animate-spin"
                    />
                  )}
                </AlertDialogAction>
                <div className="subtitle-2 text-center text-light-100">
                  Didn't get a code?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="pl-1 text-brand"
                    onClick={handleResend}
                  >
                    <RefreshCcw className={isResend ? "animate-spin" : ""} />
                    resend new code
                  </Button>
                </div>
              </div>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
