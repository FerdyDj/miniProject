"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import * as yup from "yup";

const RegSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(6, "Min 6 character")
    .required("Fullname is required!"),
  username: yup
    .string()
    .min(6, "Min 6 character")
    .required("Username is required!"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required!"),
  password: yup
    .string()
    .min(6, "Min 6 character")
    .required("Password is required!"),
  confirm: yup
    .string()
    .required("Password confirmation is required!")
    .oneOf([yup.ref("password")], "Password not match!"),
});

interface IRegForm {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  const initialValues: IRegForm = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  };

  const onRegister = async (
    value: IRegForm,
    action: FormikHelpers<IRegForm>
  ) => {
    try {
      const { data } = await axios.post("/autho", value);
      action.resetForm();
      toast.success(data.message);
      router.push("/login/organizer");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
        console.log(err);
      } else {
        toast.error("Register Failed !");
        console.log(err);
      }
    }
  };

  return (
    <div className="flex-row md:flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center justify-center w-full md:w-[60%] rounded-sm pb-8 h-full">
        <Formik
          initialValues={initialValues}
          validationSchema={RegSchema}
          onSubmit={onRegister}
        >
          {(props: FormikProps<IRegForm>) => {
            const { touched, errors, isSubmitting } = props;
            return (
              <Form
                className="container w-full md:w-[70%] px-8 md:px-0"
                autoComplete="off"
              >
                <div>
                  <h2 className="text-white text-3xl text-center my-6">
                    Register As Organizer
                  </h2>
                  <div className="relative">
                    <Field
                      name="fullname"
                      className="peer mt-2 mb-1 px-2 py-4 border border-orange-400 text-white rounded-sm w-full placeholder-transparent"
                      placeholder="fullname"
                    />
                    <label className="absolute transition-all duration-300 left-2 -top-1 bg-black px-2 peer-placeholder-shown:px-0 text-white text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-6 pointer-events-none">
                      Input your fullname
                    </label>
                    {touched.fullname && errors.fullname ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.fullname}
                      </div>
                    ) : null}
                  </div>
                  <div className="relative">
                    <Field
                      name="username"
                      className="peer mt-2 mb-1 px-2 py-4 border border-orange-400 text-white rounded-sm w-full placeholder-transparent focus:ring-amber-300"
                      placeholder="username"
                    />
                    <label className="absolute transition-all duration-300 left-2 -top-1 bg-black px-2 peer-placeholder-shown:px-0 text-white text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-6 pointer-events-none">
                      Input your username
                    </label>
                    {touched.username && errors.username ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.username}
                      </div>
                    ) : null}
                  </div>
                  <div className="relative">
                    <Field
                      name="email"
                      type="email"
                      className="peer mt-2 mb-1 px-2 py-4 border border-orange-400 text-white rounded-sm w-full placeholder-transparent after:bg-black"
                      placeholder="email"
                    />
                    <label className="absolute transition-all duration-300 left-2 -top-1 bg-black px-2 peer-placeholder-shown:px-0 text-white text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-6 pointer-events-none">
                      Input your email
                    </label>
                    {touched.email && errors.email ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="peer mt-2 mb-1 px-2 py-4 border border-orange-400 text-white rounded-sm w-full placeholder-transparent"
                      placeholder="password"
                    />
                    <button
                      type="button"
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible size={20} />
                      ) : (
                        <AiFillEye size={20} />
                      )}
                    </button>
                    <label className="absolute transition-all duration-300 left-2 -top-1 bg-black px-2 peer-placeholder-shown:px-0 text-white text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-6 pointer-events-none">
                      Input your password
                    </label>
                  </div>
                  {touched.password && errors.password ? (
                    <div className="text-red-500 text-[12px]">
                      {errors.password}
                    </div>
                  ) : null}
                </div>
                <div>
                  <div className="relative">
                    <Field
                      name="confirm"
                      type={confirm ? "text" : "password"}
                      className="peer mt-2 mb-1 px-2 py-4 border border-orange-400 text-white rounded-sm w-full placeholder-transparent"
                      placeholder="confirmpassword"
                    />
                    <button
                      type="button"
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                      onClick={() => setConfirm(!confirm)}
                    >
                      {confirm ? (
                        <AiFillEyeInvisible size={20} />
                      ) : (
                        <AiFillEye size={20} />
                      )}
                    </button>
                    <label className="absolute transition-all duration-300 left-2 -top-1 bg-black px-2 peer-placeholder-shown:px-0 text-white text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-6 pointer-events-none">
                      Password Confirmation
                    </label>
                  </div>
                  {touched.confirm && errors.confirm ? (
                    <div className="text-red-500 text-[12px]">
                      {errors.confirm}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 w-full">
                  <button
                    className="text-orange-500 font-bold py-4 px-2 rounded-sm bg-black-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg border-2 border-orange-400 w-full cursor-pointer hover:bg-orange-400 hover:text-gray-800 transition duration-300 text-shadow-sm"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Loading" : "Register"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className="flex flex-col items-center justify-center w-full md:w-[40%] p-4 h-full bg-gradient-to-r from-orange-300 to-orange-400 text-shadow-md text-center">
        <h2 className="text-5xl font-bold my-3">WELCOME</h2>
        <p>Create your account and start ballin' with full access.</p>
        <p className="my-3">Already have an account?</p>
        <Link
          href="/login/organizer"
          className="text-orange-500 bg-black px-4 py-2 rounded-lg font-bold transition duration-300 border-2 shadow-md hover:bg-gray-800 hover:border-gray-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
