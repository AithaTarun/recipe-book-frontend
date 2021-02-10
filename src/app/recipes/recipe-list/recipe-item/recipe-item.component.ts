import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {RecipeModel} from '../../recipe.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipesService} from '../../recipes.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationComponent} from '../../../confirmation/confirmation.component';
import {AuthService} from '../../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class RecipeItemComponent implements OnInit, OnDestroy
{
  @Input() recipe : RecipeModel;
  @Input() index : number;

  imageData;

  loading = false;

  favouriteSRC = "assets/Recipe%20Icons/favourite.png";
  isFavourite = false;

  favouriteRecipesSubscription : Subscription;

  constructor(private sanitizer : DomSanitizer, private router : Router, private recipeService : RecipesService ,
              private modalService : NgbModal, private route  :ActivatedRoute , public authService:AuthService)
  {

  }

  ngOnInit()
  {
    let TYPED_ARRAY = new Uint8Array(this.recipe.imageData[0].data);

    const STRING_CHAR = TYPED_ARRAY.reduce
    (
      (data, byte)=>
      {
        return data + String.fromCharCode(byte);
      }, ''
    );

    let base64String = btoa(STRING_CHAR);
    this.imageData = this.sanitizer.bypassSecurityTrustUrl("data:image/*;base64, " + base64String);

    this.favouriteRecipesSubscription = this.recipeService.favouriteRecipesUpdated.subscribe
    (
      (data)=>
      {
        this.isFavourite = data.recipes.includes(this.recipe.id);

        if (this.isFavourite)
        {
          this.favouriteSRC = "assets/Recipe%20Icons/favourite-solid.png";
        }
        else
        {
          this.favouriteSRC = "assets/Recipe%20Icons/favourite.png";
        }
      }
    )
  }

  onRecipeDelete()
  {
    this.loading = true;

    const modalReference = this.modalService.open
    (
      ConfirmationComponent
    );
    modalReference.componentInstance.headerText = 'Delete Recipe Confirmation';
    modalReference.componentInstance.content = "Are you sure to delete the recipe";

    modalReference.result.then
    (
      (result)=>
      {
        this.loading = false;
        if (result)
        {
          this.recipeService.deleteRecipe(this.recipe.id);
        }
      }
    );
  }

  onRecipeEdit()
  {
    this.router.navigate([`${this.recipe.id}/edit`],{relativeTo : this.route});
  }

  onFavMouseMove()
  {
    if (!this.isFavourite)
    {
      this.favouriteSRC = "assets/Recipe%20Icons/favourite-solid.png";
    }
    else
    {
      this.favouriteSRC = "assets/Recipe%20Icons/favourite.png";
    }
  }

  onFavMouseLeave()
  {
    if (!this.isFavourite)
    {
      this.favouriteSRC = "assets/Recipe%20Icons/favourite.png";
    }
    else
    {
      this.favouriteSRC = "assets/Recipe%20Icons/favourite-solid.png";
    }
  }

  onFavClicked()
  {
    if (this.isFavourite)
    {
      this.recipeService.removeFavouriteRecipe(this.authService.getLoggedInId(), this.recipe.id);
    }
    else
    {
      this.recipeService.addFavouriteRecipe(this.authService.getLoggedInId(), this.recipe.id);
    }
  }

  ngOnDestroy()
  {
    this.favouriteRecipesSubscription.unsubscribe();
  }

}
