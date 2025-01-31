"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function VerifyPage() {
   const [token, setToken] = useState("");
   const [verified, setVerified] = useState(false);
   const [loading, setLoading] = useState(true);
   const [verifying, setVerifying] = useState(false);

   const verifyEmail = useCallback(async () => {
      try {
         setVerifying(true);
         if (token.length > 1) {
            const response = await axios.post(`/api/users/verifyemail`, {
               token,
            });
            if (response.data.success) {
               toast.success(response.data.message);
               setVerified(true);
            }
         }
      } catch (error) {
         console.log(error);
         // catch any errors
         if (error instanceof AxiosError) {
            console.error(error);
            toast.error(error.response?.data.message);
         } else if (error instanceof Error) {
            console.error(error.message);
            toast.error(error.message);
         }
      } finally {
         setVerifying(false);
      }
   }, [token]);

   useEffect(() => {
      // Only run on client side
      const urlToken =
         new URLSearchParams(window.location.search).get("token") || "";
      setToken(urlToken);
      setLoading(false);
   }, []);

   useEffect(() => {
      if (token.length > 1 && !verified) {
         verifyEmail();
      }
   }, [token, verifyEmail, verified]);

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h2 className="text-4xl font-bold mb-4">Loading...</h2>
         </div>
      );
   }

   return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
         <h2 className="text-4xl font-bold mb-4">Verify Email</h2>
         <p className="text-gray-500 text-xl mb-4">
            {verifying
               ? "Verifying email..."
               : token
               ? `Token: ${token}`
               : "No token found"}
         </p>

         {!verifying && (
            <>
               <h3
                  className={`text-2xl ${
                     verified ? "text-green-500" : "text-red-500"
                  } mb-4`}
               >
                  {verified
                     ? "Verified Successfully"
                     : "There was an issue in verifying"}
               </h3>
               {verified && (
                  <Link
                     href="/login"
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                     Login
                  </Link>
               )}
            </>
         )}
      </div>
   );
}
