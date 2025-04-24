"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required!"),
  password: yup
    .string()
    .min(6, "Min 6 character")
    .required("Password is required!"),
});

interface ILoginForm {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues: ILoginForm = {
    email: "",
    password: "",
  };

  const onLogin = async (
    value: ILoginForm,
    action: FormikHelpers<ILoginForm>
  ) => {
    try {
      const { data } = await axios.post("/auth/login", value);
      const user = data.data;

      await signIn("credentials", {
        redirectTo: "/",
        id: user.id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar ?? "",
        refCode: user.refCode ?? "",
        refBy: user.refBy ?? "",
        role: user.role,
        accessToken: data.access_token,
      });
      toast.success("Login Success !");
      action.resetForm();
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-white">
      <div className="border-2 border-orange-500 rounded-lg w-[90%] md:w-[700px] p-8">
        <h2 className="text-center text-3xl py-8">Login as Customer</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={onLogin}
        >
          {(props: FormikProps<ILoginForm>) => {
            const { touched, errors, isSubmitting } = props;
            return (
              <Form autoComplete="off">
                <div className="text-center relative">
                  <Field
                    name="email"
                    type="email"
                    className="peer mt-2 mb-1 px-2 py-4 border border-orange-500 rounded-sm w-full placeholder-transparent"
                    placeholder="email"
                  />
                  <label className="absolute transition-all duration-300 left-2 -top-1 bg-black px-2 text-white text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-placeholder-shown:px-0 pointer-events-none">
                    Input your email
                  </label>
                  {touched.email && errors.email ? (
                    <div className="text-red-500 text-[12px]">
                      {errors.email}
                    </div>
                  ) : null}
                </div>
                <div>
                  <div className="relative text-center">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="peer mt-2 mb-1 px-2 py-4 pr-10 border border-orange-500 rounded-sm w-full placeholder-transparent"
                      placeholder="password"
                    />
                    <label className="absolute transition-all duration-300 left-2 -top-1 bg-black px-2 peer-placeholder-shown:px-0 text-white text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-6 pointer-events-none">
                      Input your password
                    </label>
                    <button
                      type="button"
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible size={20} />
                      ) : (
                        <AiFillEye size={20} />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password ? (
                    <div className="text-red-500 text-[12px] text-center">
                      {errors.password}
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 text-center w-full">
                  <button
                    className="py-4 px-2 rounded-sm bg-black text-orange-500 font-bold border border-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg w-full cursor-pointer text-shadow-sm hover:bg-orange-500 hover:text-gray-800 transition duration-300"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Loading" : "Login"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className="border-2 border-orange-500 rounded-sm mt-4 w-[90%] md:w-[700px] p-4">
        <p className="flex justify-center text-sm">
          Don't have an account?&nbsp;
          <Link
            href={"/register/customer"}
            className="text-orange-500 font-bold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
