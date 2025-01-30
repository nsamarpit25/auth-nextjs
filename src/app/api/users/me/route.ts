import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
   try {
      const userId = await getDataFromToken(req);
      if (!userId) {
         return NextResponse.json(
            {
               message: "Unauthorized Request",
               success: false,
            },
            { status: 401 }
         );
      }

      const user = await User.findById(userId).select("-password");
      if (!user) {
         return NextResponse.json(
            {
               message: "User not found",
               success: false,
            },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: "User found",
            user,
            success: true,
         },
         { status: 200 }
      );
   } catch (error) {
      if (error instanceof Error) {
         return new Response(error.message, { status: 500 });
      }
   }
}
