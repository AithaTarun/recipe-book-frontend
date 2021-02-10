import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {AbstractControl, FormControl} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from '../info/info.component';
import {map} from 'rxjs/operators';

import {RecipeModel} from './recipe.model';
import {RatingModel} from './rating.model';
import {FavouriteRecipesModel} from './favouriteRecipes.model';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.backend_URL

@Injectable
(
  {
    providedIn : 'root'
  }
)
export class RecipesService
{
  constructor(private http : HttpClient,private router : Router,private modalService : NgbModal)
  {
  }

  private recipes : RecipeModel[];
  recipesUpdated = new Subject<{recipes : RecipeModel[],recipeCount : number}>();

  private filteredRecipes : RecipeModel[] ;
  filteredRecipesUpdated = new Subject<{recipes : RecipeModel[],recipeCount : number}>();

  uniqueCategories = [];
  categoriesUpdated = new Subject<{categories : string[]}>();

  ratingsUpdated = new Subject<RatingModel>();

  favouriteRecipes : FavouriteRecipesModel;
  favouriteRecipesUpdated = new BehaviorSubject<FavouriteRecipesModel>({userId : '', recipes : ['']});

  addOrUpdateRecipe
  (
    recipeName : string,
    description : string,
    images : any[],
    ingredientControls : AbstractControl[],
    categoryControls : AbstractControl[],
    procedureControls : AbstractControl[],
    videoControls : AbstractControl[],
    id : string = undefined
  )
  {
    const formData =  new  FormData();

    formData.append("recipeName",recipeName);
    formData.append("description",description);

    for  (let i =  0; i < images.length; i++)
    {
      formData.append("imageData", images[i]);
    }

    let ingredients = [];
    for  (let i =  0; i < ingredientControls.length; i++)
    {
      const ingredient =
        {
          ingredientName : ingredientControls[i].get('ingredientName').value,
          quantity : ingredientControls[i].get('quantity').value
        }
      ingredients.push(ingredient);
    }
    formData.append("ingredients", JSON.stringify(ingredients));

    for  (let i =  0; i < categoryControls.length; i++)
    {
      const category = categoryControls[i].get('category').value

      formData.append("categories", category);
    }

    for  (let i =  0; i < procedureControls.length; i++)
    {
      const step = procedureControls[i].get('step').value
      formData.append("procedureSteps", step);
    }

    let videoURLs = [];
    for  (let i =  0; i < videoControls.length; i++)
    {
      const video =
        {
          language : videoControls[i].get('language').value,
          url : videoControls[i].get('video').value
        }
        videoURLs.push(video);
    }
    formData.append("videoURLs", JSON.stringify(videoURLs));

    if (id)
    {
      this.http.patch<{message : string,updatedRecipe:RecipeModel}>
      (
        BACKEND_URL + `/recipe/update/${id}`,
        formData
      )
        .subscribe
        (
          (result)=>
          {
            const modalReference = this.modalService.open
            (
              InfoComponent
            );
            modalReference.componentInstance.headerText = 'Notification';
            modalReference.componentInstance.content = result.message;

            this.router.navigate(['/']);
          }
        );
    }
    else
    {
      this.http.post<{message : string,savedRecipe:RecipeModel}>
      (
        BACKEND_URL + '/recipe/new',
        formData
      )
        .subscribe
        (
          (result)=>
          {
            const modalReference = this.modalService.open
            (
              InfoComponent
            );
            modalReference.componentInstance.headerText = 'Notification';
            modalReference.componentInstance.content = result.message;

            this.router.navigate(['/']);
          }
        )
    }

  }

  getRecipes()
  {
    this.http.get<{message : string,recipes : any,maxRecipes : number}>
    (
      BACKEND_URL + '/recipe/'
    )
      .pipe
      (
        map
        (
          (recipesData)=>
          {
            this.uniqueCategories = [];

            return {
              recipes : recipesData.recipes.map
                (
                  (recipe) =>
                  {
                    let modifiedRecipe =
                      {
                        ...recipe,
                        id: recipe._id,
                      };
                    delete modifiedRecipe._id;

                    //Update unique categories
                    recipe.categories.forEach
                    (
                      (category)=>
                      {
                        if (!this.uniqueCategories.includes(category))
                        {
                          this.uniqueCategories.push(category);
                        }
                      }
                    );

                    return modifiedRecipe;
                  }
                ),
              maxPosts : recipesData.maxRecipes
            }
          }
        )
      )
      .subscribe
      (
        (transformedData)=>
        {
          this.recipes = transformedData.recipes;

          this.recipesUpdated.next
          (
            {
              recipes : [...this.recipes],
              recipeCount : transformedData.maxPosts
            }
          );

          this.categoriesUpdated.next
          (
            {
              categories : [...this.uniqueCategories]
            }
          );

          this.filterCategoriesUpdated([]);
          this.searchStringUpdated('');
          this.filtersUpdated();
        }
      );
  }

  getRecipe(id:string)
  {
    return this.recipes.find(recipe=>recipe.id===id);
  }

  deleteRecipe(id : string)
  {
    this.http.delete<{message:string,deletedRecipe:RecipeModel}>(BACKEND_URL + `/recipe/${id}`)
      .subscribe
      (
        (response)=>
        {
          const modalReference = this.modalService.open
          (
            InfoComponent
          );
          modalReference.componentInstance.headerText = 'Notification';
          modalReference.componentInstance.content = response.message;

          const updatedRecipes = this.recipes.filter
          (
            (recipe)=>
            {
              return recipe.id !== id;
            }
          );

          this.recipes = updatedRecipes;
          this.recipesUpdated.next
          (
            {
              recipes : [...this.recipes],
              recipeCount : this.recipes.length
            }
          );

          this.filteredRecipesUpdated.next
          (
            {
              recipes : [...this.recipes],
              recipeCount : this.recipes.length
            }
          );
          this.updateUniqueCategories();
          this.categoriesUpdated.next
          (
            {
              categories : [...this.uniqueCategories]
            }
          );
        }
      )
  }

  addNewRating
  (
    recipeId:string,
    rating :
      {
        username : string,
        ratingValue : number,
        comment : string
      }
    )
  {
    this.http.post<{message : string,result:any}>(BACKEND_URL + `/recipe/newRating/${recipeId}`,rating)
      .subscribe();

    this.ratingsUpdated.next({username : rating.username, recipeId : recipeId, ratingValue : rating.ratingValue, comment : rating.comment})
  }

  getRecipeRatings(id : string)
  {
    return this.http.get<{message : string,ratings : RatingModel[]} >(BACKEND_URL + `/recipe/getRatings/${id}`);
  }


  addFavouriteRecipe(userId : string, recipeId : string)
  {
    const favRecipe =
      {
        userId,
        recipeId
      };
    this.favouriteRecipes.recipes.push(recipeId);
    this.favouriteRecipesUpdated.next(this.favouriteRecipes);

    this.http.post(BACKEND_URL + '/recipe/addFavRecipe', favRecipe)
      .subscribe();
  }

  removeFavouriteRecipe(userId : string, recipeId : string)
  {
    const deleteIndex = this.favouriteRecipes.recipes.indexOf(recipeId);
    this.favouriteRecipes.recipes.splice(deleteIndex,1);

    this.favouriteRecipesUpdated.next(this.favouriteRecipes);

    this.favouriteModeChanged(this.isFavouriteMode);

    this.http.delete(BACKEND_URL + `/recipe/removeFavRecipe/${recipeId}/${userId}`)
      .subscribe();
  }

  getFavouriteRecipes(userId : string)
  {
    this.http.get<{message : string, data : FavouriteRecipesModel}>(BACKEND_URL + `/recipe/getFavRecipes/${userId}`)
      .subscribe
      (
        (response)=>
        {
          this.favouriteRecipes = response.data;

          this.favouriteRecipesUpdated.next(this.favouriteRecipes);
        }
      );
  }

  updateUniqueCategories()
  {
    this.uniqueCategories = [];

    let tempRecipes;
    if (this.isFavouriteMode)
    {
      tempRecipes = this.favRecipes;
    }
    else
    {
      tempRecipes = this.recipes;
    }

    tempRecipes.forEach
    (
      (recipe)=>
      {
        recipe.categories.forEach
        (
          (category)=>
          {
            if (!this.uniqueCategories.includes(category))
            {
              this.uniqueCategories.push(category);
            }
          }
        )
      }
    );
  }

  searchString = '';
  filteredCategories = [];

  filtersUpdated()
  {
    if (this.filteredCategories.length ===0 && this.searchString==="")
    {
      this.filteredRecipes = this.isFavouriteMode ? this.favRecipes : this.recipes;
    }
    else
    {
      let tempRecipes;
      if (this.isFavouriteMode)
      {
        tempRecipes = this.favRecipes;
      }
      else
      {
        tempRecipes = this.recipes;
      }

      this.filteredRecipes = tempRecipes.filter
      (
        (recipe)=>
        {
          if (this.filteredCategories.length===0)
          {
            return recipe.recipeName.toUpperCase().includes(this.searchString.toUpperCase());
          }

          return  this.filteredCategories.some
          (
            (category)=>
            {
              return  (recipe.categories.includes(category) && recipe.recipeName.toUpperCase().includes(this.searchString.toUpperCase()));
            }
          );
        }
      );
    }

    this.filteredRecipesUpdated.next({recipes : this.filteredRecipes , recipeCount : this.filteredRecipes.length});
  }

  filterCategoriesUpdated(categories : string[])
  {
    this.filteredCategories = categories;
  }

  searchStringUpdated(text:string)
  {
    this.searchString=text;
  }

  isFavouriteMode = false;
  favRecipes = [];

  favouriteModeChanged(isFavMode : boolean)
  {
    this.isFavouriteMode = isFavMode;

    if (isFavMode)
    {
      this.filteredRecipes = this.recipes.filter
      (
        (recipe)=>
        {
          return this.favouriteRecipes.recipes.includes(recipe.id);
        }
      );

      this.favRecipes = this.filteredRecipes;
    }
    else
    {
      this.isFavouriteMode = false;

      this.filteredRecipes = this.recipes;

      this.favRecipes = [];
    }

    this.updateUniqueCategories();
    this.categoriesUpdated.next({categories : this.uniqueCategories});

    this.filteredRecipesUpdated.next({recipes : this.filteredRecipes, recipeCount : this.filteredRecipes.length});
  }
}
