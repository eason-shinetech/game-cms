import mongoose, { Document } from "mongoose";

export interface IHistory extends Document {
  _id: string;
  gameId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new mongoose.Schema<IHistory>(
  {
    gameId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type HistoryDocument = mongoose.Document & IHistory;

const HistoryModel =
  mongoose.models?.History || mongoose.model<IHistory>("History", HistorySchema);

export default HistoryModel;
