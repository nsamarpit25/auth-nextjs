import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
   try {
      // extract email and password from the request body
      const reqBody = await request.json();
      const { email, password } = reqBody;
      console.log(reqBody);

      // find user from the database
      const user = await User.findOne({ email });
      // console.log("user not found");
      if (!user) {
         return NextResponse.json(
            { message: "Incorrect email id", success: false },
            { status: 404 }
         );
      }

      // match password in the database
      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) {
         return NextResponse.json(
            { message: "Invalid password", success: false },
            { status: 400 }
         );
      }

      // create token data
      const TokenData = {
         id: user._id,
         email: user.email,
         username: user.username,
      };

      // create token
      const token = jwt.sign(TokenData, process.env.JWT_SECRET!, {
         expiresIn: "1d",
      });

      // create response
      const response = NextResponse.json({
         message: "Login successful",
         success: true,
      });

      // add cookie with token to the response
      response.cookies.set("token", token, { httpOnly: true });

      // return response
      return response;
   } catch (error) {
      console.error(error);
      if (error instanceof Error) {
         return NextResponse.json(
            { message: error.message, success: false },
            { status: 500 }
         );
      }
   }
}
