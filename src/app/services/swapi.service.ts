import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from '../models/person.model';
import { Starship } from '../models/starship.model';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private baseApiUrl = 'https://www.swapi.tech/api';
  private readonly personMaxId = 87;
  private readonly starshipMaxId = 37;

  constructor(private http: HttpClient) {}

  getRandomPerson(): Observable<{ result: { properties: Person } }> {
    const randomId = this.getRandomId(this.personMaxId);
    return this.http.get<{ result: { properties: Person } }>(`${this.baseApiUrl}/people/${randomId}`)
      .pipe(
        catchError(() => this.retryPerson())
      );
  }

  getRandomStarship(): Observable<{ result: { properties: Starship } }> {
    const randomId = this.getRandomId(this.starshipMaxId);
    return this.http.get<{ result: { properties: Starship } }>(`${this.baseApiUrl}/starships/${randomId}`)
      .pipe(
        catchError(() => this.retryStarship())
      );
  }

  private getRandomId(max: number): number {
    return Math.floor(Math.random() * max) + 1;
  }

  private retryPerson(): Observable<{ result: { properties: Person } }> {
    const retryId = this.getRandomId(this.personMaxId);
    return this.http.get<{ result: { properties: Person } }>(`${this.baseApiUrl}/people/${retryId}`)
      .pipe(
        catchError(() => of({ result: { properties: this.getFallbackPerson() } }))
      );
  }

  private retryStarship(): Observable<{ result: { properties: Starship } }> {
    const retryId = this.getRandomId(this.starshipMaxId);
    return this.http.get<{ result: { properties: Starship } }>(`${this.baseApiUrl}/starships/${retryId}`)
      .pipe(
        catchError(() => of({ result: { properties: this.getFallbackStarship() } }))
      );
  }

  private getFallbackPerson(): Person {
    return {
      name: 'Unknown Person',
      height: '0',
      mass: '0',
      gender: 'unknown',
      birth_year: 'unknown',
    };
  }

  private getFallbackStarship(): Starship {
    return {
      name: 'Unknown Starship',
      model: 'Unknown',
      crew: '0',
      manufacturer: 'Unknown',
      length: '0',
    };
  }
}
