import { Component } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {

  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero: Hero | undefined;

  constructor( private heroesService: HeroesService ) { }

  public searchHero(): void {
    const value: string = this.searchInput.value || '';

    this.heroesService.getSuggestions( value.trim() )
    .subscribe( heroes => this.heroes = heroes );

  }

  public onSelectedOption( evento: MatAutocompleteSelectedEvent ): void {
    if (!evento.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = evento.option.value;
    this.searchInput.setValue(hero.superhero);

    this.selectedHero = hero;
  }

}
