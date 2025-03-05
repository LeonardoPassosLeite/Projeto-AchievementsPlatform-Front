import { GameStatus } from "../../enums/GameStatus";

export interface Kanban {
    id: number;
    name: string;
    status: GameStatus;
    image: string;
}