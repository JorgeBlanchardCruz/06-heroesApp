import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ulid } from 'ulid';


import { Hero } from '../interfaces/hero.interface';
import { enviroments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl: string = enviroments.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  public getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  public getHeroById(id: string): Observable<Hero | undefined> {
    return this.httpClient.get<Hero>(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      catchError( error => of(undefined))
    );
  }

  public getSuggestions(term: string): Observable<Hero[]> {
    //no funciona en esta version de json-server
    return this.httpClient.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ term }&_limit=6`);
  }

  public addHero(hero: Hero): Observable<Hero> {
    hero.id = ulid();
    return this.httpClient.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  public updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id)
      throw new Error('Hero id is required to update it');

    return this.httpClient.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  public deleteHero(id: string): Observable<boolean> {
    return this.httpClient.delete<Hero>(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      map( response => true),
      catchError( error => of(false))
    );
  }

}
