import { NextResponse } from "next/server";

export async function GET() {
   try {
      // create response object
      const response = NextResponse.json({
         message: "Logged out successfully!",
         success: true,
      });

      // set token cookie to empty string and maxAge to 0
      response.cookies.set("token", "", { httpOnly: true, maxAge: 0 });

      // return response
      return response;
   } catch (error) {
      console.log("error", error);
      // catch any errors
      if (error instanceof Error) {
         return {
            status: 500,
            body: {
               error: error.message,
            },
         };
      }
   }
}
