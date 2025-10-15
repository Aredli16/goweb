import mongoose, { Document, model, Model, Schema } from "mongoose";

export interface IResponse {
  questionId: number;
  answerId: string;
}

export interface ISession extends Document {
  createdAt: Date;
  responses: IResponse[];
  isSubmitted: boolean;
}

const ResponseSchema: Schema<IResponse> = new Schema({
  questionId: { type: Number, required: true },
  answerId: { type: String, required: true },
});

const SessionSchema: Schema<ISession> = new Schema({
  createdAt: { type: Date, default: Date.now },
  responses: [ResponseSchema],
  isSubmitted: { type: Boolean, default: false },
});

export const Session: Model<ISession> =
  mongoose.models.Sesssion || model<ISession>("Session", SessionSchema);
