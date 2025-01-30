import { connect } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
   console.log("reach backend");
   try {
      const reqBody = await request.json();
      const { username, email, password } = reqBody;

      // check if user already exists
      const user = await User.findOne({ email });

      if (user) {
         return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
         );
      }

      // hash password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({
         username,
         email,
         password: hashedPassword,
      });

      const savedUser = await newUser.save();

      return NextResponse.json(
         {
            message: "User created successfully",
            success: true,
            savedUser,
         },
         { status: 201 }
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
