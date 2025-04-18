import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      default: "Admin",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "admin",
      enum: ["admin", "user"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export type UserDocument = mongoose.Document & IUser;

const UserModel =
  mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
