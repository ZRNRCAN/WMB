// angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// app components
import { AppComponent } from './app.component';
import { SearchComponent } from '@search/search.component';
import { ListSelectionExample } from './legend/nodelist.component';
import { CustomPaginator } from '@ressources/paginator';

// anuglar cdk
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';

// angular material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select'
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';  

const materialModules = [
  HttpClientModule,
  BrowserAnimationsModule,
  BrowserModule,
  DragDropModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  ReactiveFormsModule,
]

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ListSelectionExample
  ],
  imports: [
    ...materialModules
  ],

  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }