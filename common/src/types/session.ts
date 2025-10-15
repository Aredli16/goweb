import type {Document} from "mongoose";

export interface IResponse {
    questionId: number;
    answerId: string;
}

export interface ISession extends Document {
    createdAt: Date;
    responses: IResponse[];
    isSubmitted: boolean;
}