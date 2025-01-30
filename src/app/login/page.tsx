"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
   const [user, setUser] = useState({ email: "", password: "" });
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const [buttonDisabled, setButtonDisabled] = useState(false);

   async function onLogin() {
      try {
         setIsLoading(true);
         const response = await axios.post("/api/users/login", user);
         toast.success(response.data.message);
         router.push("/profile");
      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
         }
         if (error instanceof Error) {
            console.log(error);
            console.error("An error occurred:");
         }
      } finally {
         setIsLoading(false);
      }
   }

   useEffect(() => {
      if (user.email.length > 0 && user.password.length > 0) {
         setButtonDisabled(false);
      } else {
         setButtonDisabled(true);
      }
   }, [user]);

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col gap-6 p-8">
         <h1 className="text-center text-white text-3xl font-bold mb-4">
            {isLoading ? "Processing..." : "Login"}
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
            onClick={onLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mt-4"
            disabled={buttonDisabled}
         >
            Sign Up
         </button>
         <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300 transition duration-300"
         >
            Visit Sing Up
         </Link>
      </div>
   );
}
