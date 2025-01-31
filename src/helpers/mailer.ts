import { ObjectId } from "mongodb";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import nodemailer, { type SentMessageInfo } from "nodemailer";

interface SendMailProps {
   email: string;
   emailType: string;
   userId: ObjectId;
}

export async function sendMail({
   email,
   emailType,
   userId,
}: SendMailProps): Promise<{
   success: boolean;
   message: string;
   mailResponse?: SentMessageInfo;
}> {
   try {
      // created hashed token to be sent to the mail and stored in the database
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);

      // update the token in the database..
      if (emailType === "RESET_PASSWORD") {
         await User.findOneAndUpdate(
            { _id: userId },
            {
               forgetPasswordToken: hashedToken,
               forgetPasswordTokenExpiry: Date.now() + 3600000,
            }
         );
      }
      if (emailType === "VERIFY_EMAIL") {
         await User.findOneAndUpdate(
            { _id: userId },
            {
               verifyToken: hashedToken,
               verifyTokenExpiry: Date.now() + 3600000,
            }
         );
      }

      // send the mail....

      // create a transport
      const transport = nodemailer.createTransport({
         host: "sandbox.smtp.mailtrap.io",
         port: 2525,
         auth: {
            user: "6e382255b0246b",
            pass: "0608352b0e10d1",
         },
      });

      // create mail options
      const mailOptions = {
         from: "verify@nextJsAuth.com",
         to: email,
         subject:
            emailType === "RESET_PASSWORD" ? "Reset Password" : "Verify Email",
         text: `Please verify your email by clicking on the link below`,
         html: `
      <table style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
         <tr>
            <td style="background-color: #f7f7f7; padding: 40px; text-align: center; border-radius: 8px;">
               <h1 style="color: #333; margin-bottom: 20px;">${
                  emailType === "RESET_PASSWORD"
                     ? "Reset Your Password"
                     : "Verify Your Email"
               }</h1>
               <p style="color: #666; margin-bottom: 30px; font-size: 16px;">
                  Please click the button below to ${
                     emailType === "RESET_PASSWORD"
                        ? "reset your password"
                        : "verify your email address"
                  }
               </p>
               <a href="${process.env.DOMAIN}/${
            emailType === "RESET_PASSWORD" ? "reset-password" : "verify-email"
         }?token=${hashedToken}"
                  style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none;
                  border-radius: 5px; display: inline-block; font-weight: bold;">
                  ${
                     emailType === "RESET_PASSWORD"
                        ? "Reset Password"
                        : "Verify Email"
                  }
               </a>
               <p style="color: #999; margin-top: 30px; font-size: 12px;">
                  If you didn't request this, please ignore this email.
               </p>
            </td>
         </tr>
      </table>
   `,
      };

      // send the mail
      const mailResponse = await transport.sendMail(mailOptions);

      // return success message
      return { success: true, message: "Mail sent successfully", mailResponse };

      // end
   } catch (error) {
      // catch any errors
      console.error(error);
      if (error instanceof Error) {
         return { success: false, message: "Error" };
      }
      return { success: false, message: "An error occurred" };
   }
}
