import mongoose, { Document } from "mongoose";
import { BaseModel } from "./base";

export interface GameDistributionResult {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  categories: string[];
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

  platform: string;
  popularity: string;
  from?: string;
}

export interface Game extends BaseModel {
  gameId?: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  thumb: string;
  bannerImage?: string;
  width: number;
  height: number;
  categories: string[];
  tags: string[];
  lastUpdated?: Date;
  fetchFrom: string;
  status?: string;
  clickCount?: number;
}

export interface IGame extends Document {
  _id: string;
  gameId?: string;
  title: string;
  titleUrl: string;
  description: string;
  instructions: string;
  url: string;
  thumb: string; //缩略图512x512
  bannerImage: string; //横幅图片 1280x720
  images: string[]; //其他尺寸图片
  width: number;
  height: number;
  categories: string[];
  tags: string[];
  lastUpdated: Date;
  fetchFrom: string;
  platforms: string[];
  popularity: string;
  status: string;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new mongoose.Schema<IGame>(
  {
    gameId: { type: String },
    title: { type: String, required: true },
    titleUrl: { type: String, required: true }, //For SEO
    description: { type: String, required: true },
    instructions: { type: String },
    url: { type: String, required: true },
    thumb: { type: String, required: true },
    bannerImage: { type: String },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    categories: { type: [String], default: [] }, // ObjectId
    tags: { type: [String], default: [] }, // ObjectId
    lastUpdated: { type: Date },
    fetchFrom: { type: String },
    platforms: {
      type: [String],
      required: true,
    },
    popularity: String,
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
GameSchema.index({ title: 1 }, { unique: true });
GameSchema.index({ titleUrl: 1 }, { unique: true });
GameSchema.index({ platform: 1 });
GameSchema.index({ popularity: 1, status: 1 });
GameSchema.index({ categories: 1, status: 1 });
GameSchema.index({ tags: 1, status: 1 });

const GameModel =
  mongoose.models?.Game || mongoose.model<IGame>("Game", GameSchema);

export default GameModel;
