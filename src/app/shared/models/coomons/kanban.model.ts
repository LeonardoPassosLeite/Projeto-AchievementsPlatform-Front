import { GameStatus } from "../../enums/game-status";

export interface Kanban {
    id: number;
    name: string;
    status: GameStatus;
    image: string;
}