import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    imports: [
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatTableModule,
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatIconModule
    ],
    exports: [
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatTableModule,
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,
        MatPaginatorModule,
        MatAutocompleteModule
    ],
})
export class MaterialModule { }