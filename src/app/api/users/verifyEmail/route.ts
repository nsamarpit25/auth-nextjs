import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();
export default async function POST(req: NextRequest) {
   try {
      const { token } = await req.json();

      const user = await User.findOne({
         verifyToken: token,
         verifyTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
         return NextResponse.json({
            status: 400,
            json: { message: "Invalid or expired token" },
         });
      }

      user.isVerified = true;
      user.verifyToken = undefined;
      user.verifyTokenExpiry = undefined;

      await user.save();

      return NextResponse.json(
         {
            message: "Email verified successfully",
            success: true,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error(error);
      return {
         status: 500,
         json: { message: "Internal server error" },
      };
   }
}
