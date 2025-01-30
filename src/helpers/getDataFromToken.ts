import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import type { TokenData } from "@/app/api/users/login/route";

export async function getDataFromToken(req: NextRequest) {
   try {
      const token = req.cookies.get("token")?.value || "";
      if (!token) {
         return null;
      }

      const decoded = (await jwt.verify(
         token,
         process.env.JWT_SECRET!
      )) as TokenData;

      return decoded.id;
   } catch (error) {
      if (error instanceof Error) {
         throw new Error(error.message);
      }
   }
}
