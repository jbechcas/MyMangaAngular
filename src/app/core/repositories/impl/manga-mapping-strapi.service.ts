import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Manga } from "../../models/manga.model";


interface MangaRaw {
    data: Data;
    meta: Meta;
}

interface Data {
    id: number;
    attributes: MangaAttributes;
}

interface Meta {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}

interface MangaAttributes {
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    picture?: any;
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

    setUpdate(data: Partial<Manga>): any {
        const mappedData: Partial<MangaAttributes> = {};
        
        Object.keys(data).forEach(key => {
            switch(key) {
                case 'title': mappedData.title = data[key];
                    break;
                case 'description': mappedData.description = data[key];
                    break;
                case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null;
                    break;
            }
        });

        return {
            data: mappedData
        };
    }

    getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Manga> {
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: data.map<Manga>((d: Data) => this.getOne(d))
        };
    }

    getOne(data: Data | MangaRaw): Manga {
        const isMangaRaw = (data: Data | MangaRaw): data is MangaRaw => 'meta' in data;
        
        const attributes = isMangaRaw(data) ? data.data.attributes : data.attributes;
        const id = isMangaRaw(data) ? data.data.id : data.id;

        return {
            id: id.toString(),
            title: attributes.title,
            description: attributes.description,
            picture: typeof attributes.picture === 'object' ? {
                url: attributes.picture?.data?.attributes?.url,
                large: attributes.picture?.data?.attributes?.formats?.large?.url || attributes.picture?.data?.attributes?.url,
                medium: attributes.picture?.data?.attributes?.formats?.medium?.url || attributes.picture?.data?.attributes?.url,
                small: attributes.picture?.data?.attributes?.formats?.small?.url || attributes.picture?.data?.attributes?.url,
                thumbnail: attributes.picture?.data?.attributes?.formats?.thumbnail?.url || attributes.picture?.data?.attributes?.url,
            } : undefined
        };
    }

    getAdded(data: MangaRaw): Manga {
        return this.getOne(data.data);
    }

    getUpdated(data: MangaRaw): Manga {
        return this.getOne(data.data);
    }

    getDeleted(data: MangaRaw): Manga {
        return this.getOne(data.data);
    }
}