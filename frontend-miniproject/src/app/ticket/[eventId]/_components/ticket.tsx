"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import * as yup from "yup";

const Schema = yup.object().shape({
  category: yup.string().required("Category is required"),
  price: yup.number().positive().integer().required("Price is required"),
  quantity: yup.number().positive().integer().required("Quantity is required"),
  discount: yup.number().notRequired(),
});

interface ITicketForm {
  category: string;
  price: number;
  quantity: number;
}

export default function AddTicketModal({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSession();
  const initialValues: ITicketForm = {
    category: "",
    price: 0,
    quantity: 0,
  };

  const onSubmit = async (
    value: ITicketForm,
    action: FormikHelpers<ITicketForm>
  ) => {
    try {
      await axios.post(`/tickets/${eventId}`, value, {
        headers: {
            Authorization: `Bearer ${user?.data?.accessToken}`,
          }, 
      });
      setIsOpen(false);
      action.resetForm();
      toast.success("Ticket Created ✅");
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
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-orange-300 to-orange-500 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:from-orange-300 hover:to-orange-600"
      >
        Add Ticket
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-radial from-orange-200 to-orange-300 p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4">Add Ticket</h2>
            <button
                onClick={() => setIsOpen(false)}
                className="px-2 py-2 rounded-full bg-radial from-orange-300 to-orange-400 cursor-pointer mb-4"
              >
                <CgClose className="w-8 h-8" />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={Schema}
              onSubmit={onSubmit}
            >
              {(props: FormikProps<ITicketForm>) => {
                const { touched, errors, isSubmitting } = props;
                return (
                  <Form className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <label htmlFor="name" className="text-md">
                        Category
                      </label>
                      <Field
                        name="category"
                        as="select"
                        className="mt-2 mb-1 p-2 border border-gray-500 rounded-md shadow-md"
                      >
                        <option value="">Category</option>
                        <option value="EAST">EAST SEAT</option>
                        <option value="WEST">WEST SEAT</option>
                        <option value="NORTH">NORTH SEAT</option>
                        <option value="SOUTH">SOUTH SEAT</option>
                      </Field>
                      {touched.category && errors.category ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.category}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="price" className="text-md">
                        Price
                      </label>
                      <Field
                        name="price"
                        type="number"
                        min="0"
                        className="mt-2 mb-1 p-2 border border-gray-500 rounded-md shadow-md"
                      />
                      {touched.price && errors.price ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.price}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="quantity" className="text-md">
                        Quantity
                      </label>
                      <Field
                        name="quantity"
                        type="number"
                        min="0"
                        className="mt-2 mb-1 p-2 border border-gray-500 rounded-md shadow-md"
                      />
                      {touched.quantity && errors.quantity ? (
                        <div className="text-red-500 text-[12px]">
                          {errors.quantity}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4 w-full">
                      <button
                        className="text-orange-500 font-bold py-3 px-2 rounded-sm bg-black-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg border-2 border-orange-400 w-full cursor-pointer hover:bg-orange-400 hover:text-gray-800 transition duration-300 text-shadow-sm"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Loading" : "Create Ticket"}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
}
