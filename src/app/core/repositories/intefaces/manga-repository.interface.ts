import { Manga } from "../../models/manga.model";
import { IBaseRepository } from "./base-repository.interface";

export interface IMangaRepository extends IBaseRepository<Manga> {
    // Métodos específicos si se necesitan en el futuro
}