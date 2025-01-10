"use client";

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
                "flex flex-col bg-white p-[16px]",
                "rounded-[12px] shadow-[0px_10px_30px_0px_#4247611A]",
                error ? "border border-error" : "border border-input",
              )}
            >
              {label && <FormLabel className="">{label}</FormLabel>}
              <FormControl>
                <Input
                  className="no-focus body-2 border-0 px-0 shadow-none placeholder:text-light-200"
                  type={type}
                  fullWidth
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
