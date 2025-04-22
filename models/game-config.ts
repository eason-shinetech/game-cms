import mongoose, { Document } from "mongoose";

export interface GameConfig {
  _id: string;
  banners: { id: string; bannerImage: string }[];
}

export interface IGameConfig extends Document {
  _id: string;
  banners: { id: mongoose.Types.ObjectId; bannerImage: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    bannerImage: String,
  },
  {
    _id: false,
  }
);

const GameConfigSchema = new mongoose.Schema<IGameConfig>(
  {
    banners: [
      {
        type: bannerSchema,
      },
    ],
  },
  { timestamps: true }
);

export type GameConfigDocument = mongoose.Document & IGameConfig;

const GameConfigModel =
  mongoose.models?.GameConfig ||
  mongoose.model<IGameConfig>("GameConfig", GameConfigSchema, "game-configs");

export default GameConfigModel;
