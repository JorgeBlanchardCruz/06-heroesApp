import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { enviroments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = enviroments.baseUrl;
  private user?: User;
  private token: string = 'token';

  constructor(
    private http: HttpClient
  ) { }

  get currentUser(): User | undefined {
    if (!this.user)
      return undefined;

    return structuredClone(this.user);
  }

  public login(email: string, password: string): Observable<User> {

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap( user => this.user = user ),
        tap( user => localStorage.setItem(this.token, 'ieoapsodpo.weo02opas0.29iaoksd') )
      );
  }

  public checkAuth(): Observable<boolean> | boolean {

    if (!localStorage.getItem(this.token))
      return false;

    const token = localStorage.getItem(this.token);

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ),
        catchError( error => of(false) )
      );

  }

  public logout(): void {
    this.user = undefined;
    localStorage.clear();
  }

}
