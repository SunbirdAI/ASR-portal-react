import React, { forwardRef, useState } from "react";
import { cn } from "../lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef((props, ref) => {
  const { className, type, ...rest } = props;
  const [visible, setVisible] = useState(false);

  if (type === "password") {
    return (
      <div
        tabIndex={0}
        className={`group flex justify-between items-center h-12 w-full rounded-xl border border-[#E5E5E3] bg-white px-3 py-2 text-base focus-within:border-transparent focus-within:ring-2 focus-within:ring-sunbird-orange ${props.disabled ? " cursor-not-allowed opacity-50" : ""}`}
      >
        <input
          type={visible ? "text" : "password"}
          className={cn(
            "placeholder:text-[#6B6B6B] bg-transparent focus-visible:outline-none border-none disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          {...rest}
        />
        {visible ? (
          <Eye size={18} onClick={() => setVisible((current) => !current)} />
        ) : (
          <EyeOff size={18} onClick={() => setVisible((current) => !current)} />
        )}
      </div>
    );
  } else {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#E5E5E3] bg-white px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#6B6B6B] focus-visible:outline-sunbird-orange disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...rest}
      />
    );
  }
});

Input.displayName = "Input";

export { Input };
