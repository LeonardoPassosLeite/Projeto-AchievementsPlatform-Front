export interface Game {
    name: string;
    rating?: number;
    cover?: {
        url: string;
    };
    platforms?: string[];
    rating_count?: number;
}