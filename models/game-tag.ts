import mongoose, { Document } from "mongoose";

export interface IGameTag extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameTagSchema = new mongoose.Schema<IGameTag>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type UserDocument = mongoose.Document & IGameTag;

const GameTagModel =
  mongoose.models?.GameTag ||
  mongoose.model<IGameTag>("GameTag", GameTagSchema, "game-tags");

export default GameTagModel;
