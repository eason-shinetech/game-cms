export type PropsCURDOmitted = "_id" | "createdAt" | "updatedAt";

export interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
