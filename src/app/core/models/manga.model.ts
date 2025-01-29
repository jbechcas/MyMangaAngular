import { Model } from "./base.model";

export interface Manga extends Model {
    title: string;
    description?: string;
    picture?: {
        url: string | undefined;
        large: string | undefined;
        medium: string | undefined;
        small: string | undefined;
        thumbnail: string | undefined;
    };
}