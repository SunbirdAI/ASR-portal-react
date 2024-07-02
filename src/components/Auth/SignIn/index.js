import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../UI/Form";
import { Input } from "../../UI/Input";
import { FormError, FormSuccess } from "../AuthFormMessage";

import AuthCard from "../AuthWrapper";
import { Loader2 } from "lucide-react";
import { loginIntoAccount } from "../../../API";
import { NavLink, useNavigate } from "react-router-dom";

const SignInSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  });

const SignInForm = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setError("");
    setSuccess("");
    setPending(true);

    await loginIntoAccount(values)
      .then((data) => {
        if (data?.success) {
          setSuccess(data?.success);
          navigate('/')
        }

        if (data?.error) {
          setError(data?.error);
        }
      })
      .finally(() => {
        setPending(false);
        form.reset();
      });
  };

  return (
    <AuthCard
      headerLabel="Sign In"
      messageLabel="Welcome back! You've been missed."
      backref="/register"
      backrefDescription="Don't have an account?"
      backrefMessage="Sign Up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormSuccess message={success} />
          <FormError message={error} />

          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full h-auto mb-5">
                <FormLabel className="mb-1">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a username"
                    {...field}
                    disabled={pending}  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full h-auto mb-5">
                <FormLabel className="mb-1">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a password"
                    type="password"
                    {...field}
                    disabled={pending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full mb-7">
            <NavLink to="#" className="text-sm font-medium hover:underline hover:text-sunbird-orange ease-out duration-[0.3s]" >Forgot Password?</NavLink>
          </div>

          
          <button
            className="w-full h-12 outline-none flex items-center justify-center rounded-md text-base font-semibold mb-7 border-2 border-transparent bg-sunbird-orange text-white hover:bg-opacity-90 transition-all ease-out duration-[0.3s]"
            disabled={pending}
          >
            {pending ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignInForm;
