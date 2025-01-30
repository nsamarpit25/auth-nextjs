"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
   const router = useRouter();
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

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col gap-6 p-8 flex-wrap">
         <h1 className="text-center text-white text-3xl font-bold mb-4">
            Profile Page
         </h1>
         <button
            onClick={logout}
            className=" bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 mt-4"
         >
            Logout
         </button>
      </div>
   );
}
