export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
  img_logo_url?: string;
  has_community_visible_stats: number
  
  achievementsUnlocked: number;  
  totalAchievements: number;     
  trophies?: number;              

  releaseDate?: string;            
  genre?: string;       
  lastPlayed?: number; 
  playTimed?: number;          
}

export interface SteamAchievement {
  achieved: number;
  name: string;
  description: string;
}

export interface GameAchievements {
  unlocked: number;
  total: number;
}