import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {RecipesService} from '../recipes.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-filters',
  templateUrl: './recipe-filters.component.html',
  styleUrls: ['./recipe-filters.component.css']
})
export class RecipeFiltersComponent implements OnInit, OnDestroy
{

  filtersForm : FormGroup;

  recipeCategories = new FormArray([]);
  uniqueCategories = [];

  categorySubscription : Subscription;

  constructor(private recipeService : RecipesService)
  {

  }

  ngOnInit()
  {
    this.filtersForm = new FormGroup({'categories' : this.recipeCategories});

    this.categorySubscription = this.recipeService.categoriesUpdated.subscribe
    (
      ({categories})=>
      {
        this.uniqueCategories = categories;
        this.uniqueCategories.sort();

        this.recipeCategories.clear();

        this.uniqueCategories.forEach
        (
          (category)=>
          {
            this.recipeCategories.push
            (
              new FormGroup
              (
                {
                  'category' : new FormControl(false)
                }
              )
            )
          }
        );

        this.filtersForm = new FormGroup
        (
          {
            'categories' : this.recipeCategories
          }
        );
      }
    );
  }

  get categoryControls()
  {
    return (<FormArray>this.filtersForm.get('categories')).controls;
  }

  selectedCategories = [];

  selectedChanged(index : number)
  {
    if (this.recipeCategories.controls[index].value.category)
    {
      //Selected
      this.selectedCategories.push(this.uniqueCategories[index]);
    }
    else
    {
      //Deselected selected
      this.selectedCategories = this.selectedCategories.filter
      (
        (category)=>
        {
          return !(category===this.uniqueCategories[index]);
        }
      );
    }

    this.recipeService.filterCategoriesUpdated(this.selectedCategories);
    this.recipeService.filtersUpdated();
  }

  onAllFiltersCleared()
  {
    this.selectedCategories = [];
    this.recipeService.filterCategoriesUpdated([]);
    this.recipeService.filtersUpdated();
  }

  ngOnDestroy()
  {
    this.categorySubscription.unsubscribe();
  }

}
