"use client";

import axios from "@/lib/axios";
import { IEvent, IReview } from "@/types/type";
import { AxiosError } from "axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import * as yup from "yup";

const schema = yup.object().shape({
  rating: yup.number().positive().integer().required("Rating is required!"),
  comment: yup.string().notRequired(),
});

interface IReviewForm {
  rating: number;
  comment: string;
}

export default function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [event, setEvent] = useState<IEvent | null>(null);
  const { eventId } = use(params);
  const session = useSession();
  const initialValues: IReviewForm = {
    rating: 0,
    comment: "",
  };

  const fetchReview = async () => {
    try {
      const res = await axios.get(`/reviews/${eventId}`);
      setReviews(res.data.reviews);
      const response = await axios.get(`/events/${eventId}`);
      setEvent(response.data.events);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [eventId]);

  const onSubmit = async (
    value: IReviewForm,
    action: FormikHelpers<IReviewForm>
  ) => {
    try {
      await axios.post(`/reviews/${eventId}`, value, {
        headers: { Authorization: `Bearer ${session.data?.accessToken}` },
      });
      action.resetForm();
      toast.success("Reviews Created ✅");
      fetchReview();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
        console.log(err);
      } else {
        toast.error("Submit Reviews Failed !");
        console.log(err);
      }
    }
  };
  return (
    <div className="flex-row md:flex w-screen min-h-screen text-gray-300">
      <div className="px-7 mt-20 w-full md:w-[35%] -mb-14">
        <Link href={`/profile/${session.data?.user.username}/ticket`}>
          <div className="flex items-center gap-3">
            <IoArrowBackOutline className="text-3xl text-white" />
            <p>Back To Ticket</p>
          </div>
        </Link>
        <div className="flex flex-col items-center py-3">
          <Image
            src={
              event?.image ||
              "https://images.template.net/114549/free-basketball-poster-background-edit-online.jpg"
            }
            width={300}
            height={250}
            alt="event-pic"
            className="w-auto h-auto"
          />
          <h3 className="font-semibold text-2xl py-2 px-auto">
            {event?.title}
          </h3>
          <p className="text-sm text-gray-300 px-2">
            {new Date(event?.eventDate!).toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>{event?.category} MATCH</p>
          <p>{event?.venue}</p>
          <p>{event?.location}</p>
        </div>
      </div>
      <div className="mt-24 px-3 w-full md:w-[65%]">
        <div className="mt-4">
          <h3 className="text-lg text-center font-bold underline underline-offset-4 mb-7">
            Event Reviews
          </h3>
          <h4 className="text-lg mb-3">Input your reviews for the Game</h4>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={onSubmit}
          >
            {(props: FormikProps<IReviewForm>) => {
              const { touched, errors, isSubmitting } = props;
              return (
                <Form className="flex flex-col mb-5">
                  <div className="flex items-center gap-3">
                    <label htmlFor="rating" className="w-[15%]">
                      Rating :
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => props.setFieldValue("rating", star)}
                          className="focus:outline-none"
                        >
                          {star <= props.values.rating ? (
                            <AiFillStar className="text-yellow-400 text-2xl" />
                          ) : (
                            <AiOutlineStar className="text-gray-500 text-2xl" />
                          )}
                        </button>
                      ))}
                    </div>
                    {touched.rating && errors.rating ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.rating}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <label htmlFor="comment" className="w-[15%]">
                      Comment :
                    </label>
                    <Field
                      name="comment"
                      as="textarea"
                      className="w-[70%] mt-2 mb-1 p-2 border border-gray-500 rounded-md text-shadow-md text-white bg-black"
                    ></Field>
                    {touched.comment && errors.comment ? (
                      <div className="text-red-500 text-[12px]">
                        {errors.comment}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-4 w-full flex justify-center">
                    <button
                      className="text-gray-800 font-semibold py-1 px-1 rounded-sm bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg border-2 border-orange-400 w-40 cursor-pointer hover:from-orange-500 hover:via-orange-400 hover:to-orange-300 transition duration-300 text-shadow-sm"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Loading" : "Create Reviews"}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          {reviews && reviews.length > 0 ? (
            <>
              <ul>
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-3 text-sm">
                    <div>
                      <Image
                        src={review.customer.avatar}
                        width={50}
                        height={50}
                        alt="avatar-pic"
                        className="rounded-full mt-2"
                      />
                    </div>
                    <li key={review.id} className="pb-2 w-full">
                      <strong>Rating:</strong> {review.rating} / 5
                      <p>{review.comment}</p>
                      <small>
                        {new Date(review.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </small>
                      <p className="text-xs">{review.customer.fullname}</p>
                      <hr className="w-[90%] my-3 text-gray-600" />
                    </li>
                  </div>
                ))}
              </ul>
            </>
          ) : (
            <p>No reviews yet for this event.</p>
          )}
        </div>
      </div>
    </div>
  );
}
