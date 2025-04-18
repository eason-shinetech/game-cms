import mongoose, { Document } from "mongoose";

export interface IGameCategory extends Document {
  _id: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CategoryMapping = [
  {
    //动作
    name: "Action",
    categories: ["Action", "Fighting"],
    order: 1,
  },
  {
    //街机
    name: "Arcade",
    categories: ["Arcade"],
    order: 2,
  },
  {
    //冒险
    name: "Adventure",
    categories: ["Adventure"],
    order: 3,
  },
  {
    //射击
    name: "Shooting",
    categories: ["Shooting", "Bubble Shooter", "Shooter"],
    order: 4,
  },
  {
    //策略
    name: "Strategy",
    categories: ["Strategy"],
    order: 5,
  },
  {
    //多人
    name: "Multiplayer",
    categories: ["Multiplayer", "2 Player"],
    order: 6,
  },
  {
    //解谜
    name: "Puzzles",
    categories: ["Puzzles", "Puzzle"],
    order: 7,
  },
  {
    //竞赛
    name: "Racing",
    categories: ["Racing", "Racing & Driving", "Battle"],
    order: 8,
  },
  {
    //运动
    name: "Sports",
    categories: ["Sports", "Soccer", "Basketball", "Football"],
    order: 9,
  },
  {
    //休闲
    name: "Hypercasual",
    categories: [
      "Hypercasual",
      "Clicker",
      "Girls",
      "3D",
      "Boys",
      "Cooking",
      "Bejeweled",
      "Agility",
      "Mahjong & Connect",
      "Match-3",
      "Merge",
      "Casual",
      "Cards",
      "Boardgames",
      "Dress-up",
      "Care",
      "Jigsaw",
    ],
    order: 10,
  },
  {
    //.IO
    name: ".IO",
    categories: [".IO"],
    order: 11,
  },
  {
    //教育
    name: "Educational",
    categories: ["Educational", "Quiz"],
    order: 12,
  },
  {
    //其他
    name: "Others",
    categories: ["Simulation", "Art"],
    order: 13,
  },
];

const GameCategorySchema = new mongoose.Schema<IGameCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export type UserDocument = mongoose.Document & IGameCategory;

const GameCategoryModel =
  mongoose.models?.GameCategory ||
  mongoose.model<IGameCategory>(
    "GameCategory",
    GameCategorySchema,
    "game-categories"
  );

export default GameCategoryModel;
