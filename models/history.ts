import mongoose, { Document } from "mongoose";

export interface GameHistory {
  gameId: string;
  gameTitle: string;
  gameThumb: string;
  gameDescription: string;
  date: Date;
  userId: string;
}

export interface IHistory extends Document {
  _id: string;
  gameId: mongoose.Types.ObjectId;
  userId: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new mongoose.Schema<IHistory>(
  {
    gameId: mongoose.Types.ObjectId,
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type HistoryDocument = mongoose.Document & IHistory;

HistorySchema.index({ userId: 1, date: 1, gameId: 1 }, { unique: true });

const HistoryModel =
  mongoose.models?.History ||
  mongoose.model<IHistory>("History", HistorySchema);

export default HistoryModel;
