"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface InputControllerProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
}

const InputController = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  defaultValue,
}: InputControllerProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { error } = useFormField();

        return (
          <FormItem>
            <div
              className={cn(
                "bg-white p-[16px] flex flex-col",
                "rounded-[12px] shadow-[0px_10px_30px_0px_#4247611A]",
                error ? "border border-error" : "border border-input"
              )}
            >
              <FormLabel className="">{label}</FormLabel>
              <FormControl>
                <Input
                  className="no-focus border-0 shadow-none px-0 body-2 placeholder:text-light-200"
                  type={type}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage className="body-2 ml-4" />
          </FormItem>
        );
      }}
      defaultValue={defaultValue}
    />
  );
};

export default InputController;
