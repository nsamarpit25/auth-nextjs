import { model, models, Schema, type Model } from "mongoose";

export interface IUser extends Document {
   username: string;
   email: string;
   password: string;
   isVerified: boolean;
   isAdmin: boolean;
   forgetPasswordToken?: string;
   forgetPasswordTokenExpiry?: Date;
   verifyToken?: string;
   verifyTokenExpiry?: Date;
}

const UserSchema = new Schema<IUser>({
   username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
   },
   email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
   },
   password: {
      type: String,
      required: [true, "Please provide a password"],
   },
   isVerified: {
      type: Boolean,
      default: false,
   },
   isAdmin: {
      type: Boolean,
      default: false,
   },
   forgetPasswordToken: String,
   forgetPasswordTokenExpiry: Date,
   verifyToken: String,
   verifyTokenExpiry: Date,
});

type UserModel = Model<IUser>;

const User: UserModel =
   (models.users as UserModel) || model<IUser, UserModel>("users", UserSchema);

export default User;
