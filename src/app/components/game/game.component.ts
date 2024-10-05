import { Component } from '@angular/core';
import { SwapiService } from '../../services/swapi.service';
import { GameState, IncrementLeftWins, IncrementRightWins } from '../../store/game-state';
import { forkJoin, map, Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Person } from '../../models/person.model';
import { Starship } from '../../models/starship.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  left!: Person | Starship;
  right!: Person | Starship;
  winner: string | null = null;
  isPersonGame: boolean = false;
  loading: boolean = false;

  leftWins$!: Observable<number>;
  rightWins$!: Observable<number>;

  constructor(private swapiService: SwapiService, private store: Store) {}

  ngOnInit(): void {
    this.leftWins$ = this.store.select(GameState.getLeftWins).pipe(map(wins => wins ?? 0));
    this.rightWins$ = this.store.select(GameState.getRightWins).pipe(map(wins => wins ?? 0));
  }

  play(): void {
    this.loading = true;
    this.winner = null;
    const isPersonGame = Math.random() < 0.5;
    this.isPersonGame = isPersonGame;

    if (isPersonGame) {
      forkJoin([this.swapiService.getRandomPerson(), this.swapiService.getRandomPerson()]).subscribe(
        ([leftPerson, rightPerson]) => {
          this.left = leftPerson.result.properties;
          this.right = rightPerson.result.properties;
          this.compare();
        },
        (error) => {
          this.handleError(error);
        },
        () => {
          this.loading = false;
        }
      );
    } else {
      forkJoin([this.swapiService.getRandomStarship(), this.swapiService.getRandomStarship()]).subscribe(
        ([leftStarship, rightStarship]) => {
          this.left = leftStarship.result.properties;
          this.right = rightStarship.result.properties;
          this.compare();
        },
        (error) => {
          this.handleError(error);
        },
        () => {
          this.loading = false;
        }
      );
    }
  }

  compare(): void {
    if (this.left && this.right) {
      if (this.isPersonGame) {
        this.compareMass();
      } else {
        this.compareCrew();
      }
    }
  }
  
  compareMass(): void {
    if (this.isPerson(this.left) && this.isPerson(this.right)) {
      const leftMass = parseInt(this.left.mass);
      const rightMass = parseInt(this.right.mass);
  
      if (leftMass > rightMass) {
        this.winner = 'Left wins by mass!';
        this.store.dispatch(new IncrementLeftWins());
      } else if (leftMass < rightMass) {
        this.winner = 'Right wins by mass!';
        this.store.dispatch(new IncrementRightWins());
      } else {
        this.winner = 'Draw on mass!';
      }
    }
  }
  
  compareCrew(): void {
    if (this.isStarship(this.left) && this.isStarship(this.right)) {
      const leftCrew = parseInt(this.left.crew);
      const rightCrew = parseInt(this.right.crew);
  
      if (leftCrew > rightCrew) {
        this.winner = 'Left wins by crew!';
        this.store.dispatch(new IncrementLeftWins());
      } else if (leftCrew < rightCrew) {
        this.winner = 'Right wins by crew!';
        this.store.dispatch(new IncrementRightWins());
      } else {
        this.winner = 'Draw on crew!';
      }
    }
  }

  handleError(error: any): void {
    console.error('API Error:', error);
    this.loading = false;
  }

  isPerson(obj: Person | Starship): obj is Person {
    return (obj as Person).mass !== undefined;
  }

  isStarship(obj: Person | Starship): obj is Starship {
    return (obj as Starship).crew !== undefined;
  }
}
