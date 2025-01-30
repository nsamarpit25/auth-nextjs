"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SingUpPage() {
   const router = useRouter();
   const [user, setUser] = useState({ username: "", email: "", password: "" });
   const [buttonDisabled, setButtonDisabled] = useState(false);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (
         user.username.length > 0 &&
         user.email.length > 0 &&
         user.password.length > 0
      ) {
         setButtonDisabled(false);
      } else {
         setButtonDisabled(true);
      }
   }, [user]);

   async function onSubmit() {
      try {
         setLoading(true);
         console.log(user);
         const response = await axios.post("/api/users/signup", user);
         toast.success(response.data.message);
         console.log(response.data);
         router.push("/login");
      } catch (error) {
         console.error(error);
         if (error instanceof AxiosError) {
            toast.error(error.response?.data?.error || error.message);
         } else {
            toast.error("An error occurred");
         }
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col gap-6 p-8">
         <button
            onClick={() => {
               toast.success("hello");
            }}
         >
            Toast
         </button>
         <h1 className="text-center text-white text-3xl font-bold mb-4">
            {loading ? "processing.." : "Sign Up"}
         </h1>
         <div className="flex gap-4 flex-row items-center">
            <label
               htmlFor="username"
               className="text-white w-24"
            >
               Username:
            </label>
            <input
               type="text"
               className="p-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none w-64"
               value={user.username}
               placeholder="username"
               onChange={(e) => {
                  setUser({ ...user, username: e.target.value });
               }}
            />
         </div>
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
         <div className="flex gap-4 flex-row items-center">
            <label
               htmlFor="username"
               className="text-white w-24"
            >
               Password:
            </label>
            <input
               placeholder="password"
               type="password"
               className="p-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none w-64"
               value={user.password}
               onChange={(e) => {
                  setUser({ ...user, password: e.target.value });
               }}
            />
         </div>
         <button
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mt-4"
            disabled={buttonDisabled}
         >
            {buttonDisabled ? "Fill in all fields" : "Sign Up"}
         </button>
         <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 transition duration-300"
         >
            Visit Login
         </Link>
      </div>
   );
}
