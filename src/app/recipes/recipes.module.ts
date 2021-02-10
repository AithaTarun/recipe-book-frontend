import {NgModule} from '@angular/core';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RecipeEditComponent} from './recipe-edit/recipe-edit.component';
import {RecipeListComponent} from './recipe-list/recipe-list.component';
import {RecipeItemComponent} from './recipe-list/recipe-item/recipe-item.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {RecipesRoutingModule} from './recipes-routing.module';
import {
  NgbCarouselModule,
  NgbCollapseModule,
  NgbPaginationModule,
  NgbPopoverModule,
  NgbRatingModule, NgbToastModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { RecipesComponent } from './recipes.component';
import { RecipeFiltersComponent } from './recipe-filters/recipe-filters.component';
import {RatingComponent} from './recipe-detail/rating/rating.component';

@NgModule
(
  {
    declarations:
      [
        RecipeDetailComponent,
        RecipeListComponent,
        RecipeItemComponent,
        RecipeEditComponent,
        RecipesComponent,
        RecipeFiltersComponent,
        RatingComponent
      ],

    imports:
      [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        RecipesRoutingModule,
        NgbPaginationModule,
        NgbCollapseModule,
        NgbCarouselModule,
        NgbTooltipModule,
        NgbRatingModule,
        NgbPopoverModule,
        NgbToastModule
      ],

    providers:
    [

    ]
  }
)
export class RecipesModule
{

}
