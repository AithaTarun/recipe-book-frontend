import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipesService} from './recipes.service';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit
{
  constructor(private route : ActivatedRoute, private router : Router, private recipeService : RecipesService, public authService:AuthService)
  {

  }

  ngOnInit()
  {

  }

  onNewRecipe()
  {
    this.router.navigate(['new'], {relativeTo : this.route});
  }

  searchChanged(event:any)
  {
    this.recipeService.searchStringUpdated(event.target.value);
    this.recipeService.filtersUpdated();
  }

  favModeChanged(e : any)
  {
    this.recipeService.favouriteModeChanged(e.target.checked);
  }

}
