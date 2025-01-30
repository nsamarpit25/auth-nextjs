"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
   const router = useRouter();
   const [userData, setUserData] = useState("");
   async function logout() {
      try {
         const response = await axios.get("/api/users/logout");
         if (response.data.success) {
            toast.success(response.data.message);
         }
         router.push("/login");
      } catch (error) {
         // catch any errors
         if (error instanceof Error) {
            console.error(error.message);
            toast.error(error.message);
         }
      }
   }

   async function getUserData() {
      try {
         const response = await axios.get("/api/users/me");
         if (response.data.success) {
            console.log(response.data);
            toast.success(response.data.message);
            setUserData(response.data.user._id);
         }
      } catch (error) {
         console.log(error);
         if (error instanceof AxiosError) {
            console.error(error.response?.data.message);
            toast.error(error.response?.data.message);
            return;
         }
         if (error instanceof Error) {
            console.error(error);
            toast.error("An error occurred");
         }
      }
   }

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col gap-6 p-8 flex-wrap">
         <h1 className="text-center text-white text-3xl font-bold mb-4">
            Profile Page
         </h1>
         <Link href={`/profile/${userData}`}>
            Go To your profile: {userData}
         </Link>
         <button
            onClick={logout}
            className=" bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mt-4"
         >
            Logout
         </button>
         <button
            onClick={getUserData}
            className=" bg-green-600 hover:bg-greeb-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mt-4"
         >
            Get User Data
         </button>
      </div>
   );
}
