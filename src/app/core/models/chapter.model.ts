import { Model } from "./base.model";

export interface Chapter extends Model {
    title: string;
    description?: string;
    mangaId?:string,
}