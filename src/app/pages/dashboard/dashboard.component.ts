import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from '../../shared/components/nav/nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  categories = [
    { label: 'Notícias', value: 'noticias' },
    { label: 'Jogos Lançamentos', value: 'jogos-lancamento' },
    { label: 'Filmes', value: 'filmes' },
    { label: 'Séries', value: 'series' }
  ];

  constructor(private router: Router) { }

  onCategorySelected(category: string): void {
    console.log('Selected Category:', category);
    switch (category) {
      case 'noticias':
        this.router.navigate(['dashboard/noticias']);
        break;
      case 'jogos-lancamento':
        this.router.navigate(['dashboard/jogos-lancamento']);
        break;
      case 'filmes':
        this.router.navigate(['dashboard/filmes']);
        break;
      case 'series':
        this.router.navigate(['dashboard/series']);
        break;
      default:
        console.error('Categoria não reconhecida');
    }
  }
}