import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Manga } from "../../models/manga.model";

export interface MangaRaw {
    id?: string;
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    picture?: {
        data?: {
            id: number;
            attributes: {
                url: string;
                formats?: {
                    large?: { url: string };
                    medium?: { url: string };
                    small?: { url: string };
                    thumbnail?: { url: string };
                };
            };
        };
    };
}

@Injectable({
    providedIn: 'root'
})
export class MangaMappingStrapi implements IBaseMapping<Manga> {
    setAdd(data: Manga): any {
        return {
            data: {
                title: data.title,
                description: data.description,
                picture: data.picture ? Number(data.picture) : null
            }
        };
    }

    setUpdate(data: Manga): any {
        let toReturn: any = {};
        Object.keys(data).forEach(key => {
            switch (key) {
                case 'title': toReturn['title'] = data[key];
                    break;
                case 'description': toReturn['description'] = data[key];
                    break;
                default:
            }
        });
        return { data: toReturn };
    }

    getPaginated(page: number, pageSize: number, pages: number, data: any[]): Paginated<Manga> {
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: data.map(d => this.getOne(d))
        };
    }

    getOne(data: any): Manga {
        const attributes = data.attributes || data;
        return {
            id: (data.id || attributes.id)?.toString()!,
            title: attributes.title,
            description: attributes.description,
            picture: attributes.picture?.data ? {
                url: attributes.picture.data.attributes.url,
                large: attributes.picture.data.attributes.formats?.large?.url || attributes.picture.data.attributes.url,
                medium: attributes.picture.data.attributes.formats?.medium?.url || attributes.picture.data.attributes.url,
                small: attributes.picture.data.attributes.formats?.small?.url || attributes.picture.data.attributes.url,
                thumbnail: attributes.picture.data.attributes.formats?.thumbnail?.url || attributes.picture.data.attributes.url
            } : undefined
        };
    }

    getAdded(data: any): Manga {
        return this.getOne(data.data);
    }

    getUpdated(data: any): Manga {
        return this.getOne(data.data);
    }

    getDeleted(data: any): Manga {
        return this.getOne(data.data);
    }
}