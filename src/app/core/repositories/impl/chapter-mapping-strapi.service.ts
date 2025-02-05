import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Chapter } from "../../models/chapter.model";

export interface ChapterRaw {
    id?: string;
    title: string;
    description?: string;
    manga?: {
        data: {
            id: number;
        }
    };
}

@Injectable({
    providedIn: 'root'
})
export class ChapterMappingStrapi implements IBaseMapping<Chapter> {
    setAdd(data: Chapter): any {
        return {
            data: {
                title: data.title,
                description: data.description,
                manga: data.mangaId ? Number(data.mangaId) : null
            }
        };
    }

    setUpdate(data: Partial<Chapter>): any {
        let toReturn: any = {};

        Object.keys(data).forEach(key => {
            switch (key) {
                case 'title': toReturn['title'] = data[key];
                    break;
                case 'description': toReturn['description'] = data[key];
                    break;
                case 'mangaId': toReturn['manga'] = data[key] ? Number(data[key]) : null;
                    break;
            }
        });

        return { data: toReturn };
    }

    getPaginated(page: number, pageSize: number, pages: number, data: any[]): Paginated<Chapter> {
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: data.map(d => this.getOne(d))
        };
    }

    getOne(data: any): Chapter {
        return {
            id: data.id!,
            title: data.title,
            description: data.description ?? '',
            mangaId: (data as any)["manga"]?.data?.id?.toString() ?? ''
        };
    }

    getAdded(data: any): Chapter {
        return this.getOne(data.data);
    }

    getUpdated(data: any): Chapter {
        return this.getOne(data.data);
    }

    getDeleted(data: any): Chapter {
        return this.getOne(data.data);
    }
}