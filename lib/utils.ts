import { clsx, type ClassValue } from "clsx"
import mongoose from "mongoose";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uuid = () => {
  return crypto.randomUUID();
}

export const isValidMongoId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const isValidMongoIds = (ids: string[]) => {
  return !ids?.length || ids.every(id => isValidMongoId(id));
};

export const convertToMongoId = (id: string | null | undefined) => {
  return id && isValidMongoId(id) ? (new mongoose.Types.ObjectId(id) as unknown as mongoose.Schema.Types.ObjectId) : null;
};