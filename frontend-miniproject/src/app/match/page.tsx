"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";

const CreateSchema = yup.object().shape({
  image: yup.mixed().required("Image is required!"),
  title: yup.string().required("Title is required!"),
  category: yup.string().required("Category is required!"),
  eventDate: yup.string().required("Event date is required!"),
  startTime: yup.string().required("Start time is required!"),
  endTime: yup.string().required("End time is required!"),
  location: yup.string().required("Location is required!"),
  venue: yup.string().required("Venue is required!"),
  description: yup.string().required("Description is required!"),
});

interface ICreateForm {
  image: File | null;
  title: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  venue: string;
  description: string;
}

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const user = useSession();
  const router = useRouter();
  const initialValues: ICreateForm = {
    image: null,
    title: "",
    category: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    venue: "",
    description: "",
  };

  const onCreate = async (
    value: ICreateForm,
    action: FormikHelpers<ICreateForm>
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", value.image as File);
      formData.append("title", value.title);
      formData.append("category", value.category);
      formData.append("eventDate", value.eventDate);
      formData.append("startTime", value.startTime);
      formData.append("endTime", value.endTime);
      formData.append("location", value.location);
      formData.append("venue", value.venue);
      formData.append("description", value.description);

      const { data } = await axios.post("/events/cloud", formData, {
        headers: {
          Authorization: `Bearer ${user.data?.accessToken}`,
        },
      });
      action.resetForm();
      setSelectedImage(null);
      toast.success(data.message);
      router.push("/dashboard");
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (f) {
      setSelectedImage(f);
    }
  };

  return (
    <div className="flex justify-center h-screen w-screen mt-16">
      <div className="flex flex-col items-center justify-center w-[90%] md:w-[850px] rounded-sm pb-8 h-full">
        <Formik
          initialValues={initialValues}
          validationSchema={CreateSchema}
          onSubmit={onCreate}
        >
          {(props: FormikProps<ICreateForm>) => {
            const { touched, errors, isSubmitting, setFieldValue } = props;
            return (
              <Form
                className="container w-full md:w-[70%] px-8 md:px-0"
                autoComplete="off"
              >
                <div>
                  <h2 className="text-white text-3xl text-center my-6">
                    Create Match Form
                  </h2>
                  <div>
                    <label htmlFor="image" className="text-white font-semibold">
                      Match Image
                    </label>
                    <input
                      name="image"
                      type="file"
                      className="mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setFieldValue("image", f);
                        handleImageChange(e);
                      }}
                    />
                    {touched.image && errors.image ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.image}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex w-full gap-3">
                    <div className="flex-2/3">
                      <label
                        htmlFor="title"
                        className="text-white font-semibold"
                      >
                        Title
                      </label>
                      <Field
                        name="title"
                        className="mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                      />
                      {touched.title && errors.title ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.title}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex-1/3">
                      <label
                        htmlFor="category"
                        className="text-white font-semibold"
                      >
                        Category
                      </label>
                      <Field
                        name="category"
                        as="select"
                        className="mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200 text-center"
                      >
                        <option value="">Category</option>
                        <option value="FRIENDLY">Friendly Match</option>
                        <option value="LEAGUE">League Match</option>
                        <option value="CHAMPIONSHIP">Championship Match</option>
                      </Field>
                      {touched.category && errors.category ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.category}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex w-full gap-3">
                    <div className="flex-2/4">
                      <label
                        htmlFor="eventDate"
                        className="text-white font-semibold"
                      >
                        Event Date
                      </label>
                      <Field
                        name="eventDate"
                        type="date"
                        className=" mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                      />

                      {touched.eventDate && errors.eventDate ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.eventDate}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex-1/4">
                      <label
                        htmlFor="startTime"
                        className="text-white font-semibold"
                      >
                        Start Time
                      </label>
                      <Field
                        name="startTime"
                        type="time"
                        className="mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                        placeholder="startTime"
                      />
                      {touched.startTime && errors.startTime ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.startTime}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex-1/4">
                      <label
                        htmlFor="endTime"
                        className="text-white font-semibold"
                      >
                        End Time
                      </label>
                      <Field
                        name="endTime"
                        type="time"
                        className="mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                      />
                      {touched.endTime && errors.endTime ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.endTime}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-3">
                  <div className="flex-1/2">
                    <label
                      htmlFor="location"
                      className="text-white font-semibold"
                    >
                      Location
                    </label>
                    <Field
                      name="location"
                      className="mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                    />

                    {touched.location && errors.location ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.location}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex-1/2">
                    <label htmlFor="venue" className="text-white font-semibold">
                      Venue
                    </label>
                    <Field
                      name="venue"
                      className=" mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                    />
                    {touched.venue && errors.venue ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.venue}
                      </div>
                    ) : null}
                  </div>
                </div>
                <label
                  htmlFor="description"
                  className="text-white font-semibold"
                >
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className=" mt-2 mb-1 px-2 py-3 border border-orange-400 rounded-sm w-full bg-slate-200"
                />
                {touched.description && errors.description ? (
                  <div className="text-red-500 text-[12px]">
                    {errors.description}
                  </div>
                ) : null}
                <div className="mt-4 w-full">
                  <button
                    className="text-orange-500 font-bold py-3 px-2 rounded-sm bg-black-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg border-2 border-orange-400 w-full cursor-pointer hover:bg-orange-400 hover:text-gray-800 transition duration-300 text-shadow-sm"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Loading" : "Create Match"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
