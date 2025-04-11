import { Pipe, PipeTransform } from "@angular/core";
import { AccountGame } from "../models/account-game.model";

@Pipe({
    name: 'filterByName',
    standalone: true
})
export class FilterByNamePipe implements PipeTransform {
    transform(games: AccountGame[], search: string): AccountGame[] {
        if (!search) return games;
        return games.filter(g => g.gameName.toLowerCase().includes(search.toLowerCase()));
    }
}
