import mongoose, { Document } from "mongoose";
import { BaseModel } from "./base";

export interface GameDistributionResult {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  categorys: string[];
  tags: string[];
  bannerImage: string;
  images: string[];
  thumb: string;
  width: number;
  height: number;
}

export interface GameMonetizeResult {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: number;
  height: number;
}

export interface Game extends BaseModel {
  gameId: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  thumb: string;
  bannerImage?: string;
  images?: string[];
  width: number;
  height: number;
  categoryIds: string[];
  tagIds: string[];
  lastUpdated?: Date;
  fetchFrom: string;
  status?: string;
  clickCount?: number;
}

export interface IGame extends Document {
  _id: string;
  gameId: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  thumb: string; //缩略图512x512
  bannerImage: string; //横幅图片 1280x720
  images: string[]; //其他尺寸图片
  width: number;
  height: number;
  categoryIds: mongoose.Types.ObjectId[];
  tagIds: mongoose.Types.ObjectId[];
  lastUpdated: Date;
  fetchFrom: string;
  status: string;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new mongoose.Schema<IGame>(
  {
    gameId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String },
    url: { type: String, required: true },
    thumb: { type: String, required: true },
    bannerImage: { type: String },
    images: { type: [String], default: [] },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    categoryIds: { type: [mongoose.Types.ObjectId], default: [] }, // ObjectId
    tagIds: { type: [mongoose.Types.ObjectId], default: [] }, // ObjectId
    lastUpdated: { type: Date },
    fetchFrom: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published"],
      default: "draft",
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export type GameDocument = mongoose.Document & IGame;

//增加索引
GameSchema.index({ gameId: 1 });
GameSchema.index({ title: "text", fetchFrom: 1 });
GameSchema.index({ categoryIds: 1, status: 1 });
GameSchema.index({ tagIds: 1, status: 1 });

const GameModel =
  mongoose.models?.Game || mongoose.model<IGame>("Game", GameSchema);

export default GameModel;
