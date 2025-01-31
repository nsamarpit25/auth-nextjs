import { connect } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import { sendMail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
   try {
      // get email from request body
      const reqBody = await request.json();
      const { email } = reqBody;
      console.log("reached backend");

      // check if user really exists
      const user = await User.findOne({ email });

      // if user does not exist, return error
      if (!user) {
         return NextResponse.json(
            { error: "User doesn't exists" },
            { status: 404 }
         );
      }

      // send mail to user
      await sendMail({
         email,
         emailType: "RESET_PASSWORD",
         userId: user._id,
      });

      // send response
      return NextResponse.json(
         {
            message: "Mail sent successfully",
            success: true,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
      let message = "An error occurred";
      if (error instanceof Error) {
         message = error.message;
      }
      return NextResponse.json({ message, success: false });
   }
}
