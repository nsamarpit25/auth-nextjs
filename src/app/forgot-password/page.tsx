"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
   const [user, setUser] = useState({ email: "" });
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const [buttonDisabled, setButtonDisabled] = useState(false);
   const [linkSent, setLinkSent] = useState(false);
   const [invalidEmail, setInvalidEmail] = useState(false);

   async function onLogin() {
      try {
         setIsLoading(true);
         const response = await axios.post("/api/users/getpasswordresetlink", {
            email: user.email,
         });
         if (response.data.success) {
            toast.success(response.data.message);
            setLinkSent(true);
            router.push("/login");
         }
         if (response.status === 404) {
            setInvalidEmail(true);
         }
      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
         }
         if (error instanceof Error) {
            console.log(error);
            toast.error("An error occurred:");
         }
      } finally {
         setIsLoading(false);
      }
   }

   useEffect(() => {
      if (user.email.length > 0) {
         setButtonDisabled(false);
      } else {
         setButtonDisabled(true);
      }
   }, [user]);

   if (invalidEmail) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col gap-6 p-8">
            <h1 className="text-center text-white text-3xl font-bold mb-4">
               {"User doesn't exist"}
            </h1>

            <Link
               href="/signup"
               className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
               Visit Sign In
            </Link>
         </div>
      );
   }

   if (linkSent) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col gap-6 p-8">
            <h1 className="text-center text-white text-3xl font-bold mb-4">
               Check your email for the link
            </h1>

            <Link
               href="/login"
               className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
               Visit Log In
            </Link>
         </div>
      );
   }

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col gap-6 p-8">
         <h1 className="text-center text-white text-3xl font-bold mb-4">
            {isLoading ? "Processing..." : "Forgot Password"}
         </h1>

         <div className="flex gap-4 flex-row items-center">
            <label
               htmlFor="username"
               className="text-white w-24"
            >
               Email:
            </label>
            <input
               placeholder="email"
               type="email"
               className="p-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none w-64"
               value={user.email}
               onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
               }}
            />
         </div>

         <button
            onClick={onLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mt-4"
            disabled={buttonDisabled}
         >
            Get Link
         </button>
         <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 transition duration-300"
         >
            Visit Log In
         </Link>
         <Link
            href="/forgot-password"
            className="text-blue-400 hover:text-blue-300 transition duration-300"
         >
            Forgot Password
         </Link>
      </div>
   );
}
