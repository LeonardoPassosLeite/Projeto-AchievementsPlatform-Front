export interface GameAchievement {
    id: number;
    name: string;
    achieved: boolean;
    unlockTime: number;
    icon: string;
    description: string;
    rarity: number;
    steamPoints: number;
    accountGameId: number;
}