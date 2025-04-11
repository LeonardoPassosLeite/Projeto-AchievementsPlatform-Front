export function formatPlaytimeForever(minutes: number): string {
    const hours = minutes / 60;
  
    if (hours >= 24) {
      const days = hours / 24;
      return `${days.toFixed(1)} dias`;
    }
  
    return `${hours.toFixed(1)} horas`;
  }
  