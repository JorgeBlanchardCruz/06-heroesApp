import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters:       new FormControl<string>(''),
    alt_img:          new FormControl<string>(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];


  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if ( !this.router.url.includes('edit') )
      return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById(id) )
      )
      .subscribe( hero => {

        if (!hero) {
          return this.router.navigateByUrl('/');
        }

        this.heroForm.reset(hero);
        return;
      });
  }

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  public onSubmit() {
    // console.log({
    //   formIsValid: this.heroForm.valid,
    //   value: this.heroForm.value
    // });

    if (this.heroForm.invalid)
      return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe( hero => {
          this.showSnackBar(`${ hero.superhero } updated!`)
        });

        return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(`${ hero.superhero } created!`)
      });

  }

  public onDeleteHero() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialog.afterClosed()
      .pipe(

        filter( (result: boolean) => result ),
        switchMap( () => this.heroesService.deleteHero(this.currentHero.id!) ),
        filter( (wasDeleted: boolean) => wasDeleted )

      )
      .subscribe(() => {

        this.router.navigate(['/heroes']);

      });
  }

  public showSnackBar(message: string): void {
    this.snackBar.open(message, 'ok!', {
      duration: 5000
    });
  }

}
