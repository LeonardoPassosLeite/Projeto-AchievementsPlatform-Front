import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JogosComponent } from './jogos.component'; 

const routes: Routes = [
    { path: '', component: JogosComponent } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JogosRoutingModule {}