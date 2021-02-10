import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbCarousel, NgbModal, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';
import {RecipesService} from '../recipes.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {InfoComponent} from '../../info/info.component';
import {EmbedVideoService} from 'ngx-embed-video';

import {RecipeModel} from '../recipe.model';
import {RatingModel} from '../rating.model';
import {AuthService} from '../../auth/auth.service';
import {LoginComponent} from '../../auth/login/login.component';
import {Subscription} from 'rxjs';

import {NotificationsService} from '../../notification/notifications.service';
import {ShoppingListService} from '../../shopping-list/shopping-list.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy
{
  public collapsed = false;

  recipe : RecipeModel;
  id : string;
  images = [];
  videos = [];

  loading = true;

  ratings : RatingModel[] = [];
  averageRecipeRating: any = 0;
  ratingsSubscription = new Subscription();

  constructor(private recipeService : RecipesService , private route : ActivatedRoute , private router : Router, private sanitizer : DomSanitizer ,
              private modalService : NgbModal, private embedVideoService:EmbedVideoService, public authService : AuthService,
              public notificationService : NotificationsService, private shoppingListService : ShoppingListService)
  {

  }

  ngOnInit()
  {
    this.route.params
      .subscribe
    (
      (params : Params)=>
      {
        this.id = params['id'];

        this.recipe = this.recipeService.getRecipe(this.id);

        this.loading= false;
      }
    );

    if (!this.recipe)
    {
      const modalReference = this.modalService.open
      (
        InfoComponent
      );
      modalReference.componentInstance.headerText = 'Error';
      modalReference.componentInstance.content = "Data Unavailable";

      this.router.navigate(['']);
    }

    for (let recipeImage of this.recipe.imageData)
    {
      let TYPED_ARRAY = new Uint8Array(recipeImage.data);

      const STRING_CHAR = TYPED_ARRAY.reduce
      (
        (data, byte)=>
        {
          return data + String.fromCharCode(byte);
        }, ''
      );

      let base64String = btoa(STRING_CHAR);
      this.images.push(this.sanitizer.bypassSecurityTrustUrl("data:image/*;base64, " + base64String));
    }

    for (let video of this.recipe.videoURLs)
    {
      const doc = new DOMParser();
      const element = this.embedVideoService.embed(video.url);
      const htmlElement = doc.parseFromString(element.changingThisBreaksApplicationSecurity,"text/html");
      const embedURL = htmlElement.body.firstElementChild.attributes.getNamedItem("src").value;

      this.videos.push({url : this.sanitizer.bypassSecurityTrustResourceUrl(embedURL) , language : video.language})
    }

    this.ratingsSubscription = this.recipeService.getRecipeRatings(this.recipe.id)
      .subscribe
      (
        (result)=>
        {
          this.ratings = result.ratings;

          this.calculateAverageRating();
        }
      );

    this.recipeService.ratingsUpdated.subscribe
    (
      (result)=>
      {
        const rating =
          {
            username : result.username,
            recipeId : result.recipeId,
            ratingValue : result.ratingValue,
            comment : result.comment
          };
        this.ratings.push(rating);
        this.calculateAverageRating();
      }
    );

    this.videosCarousel.pause();
    this.videosCarousel.showNavigationArrows=false;

    this.imagesCarousel.showNavigationArrows=false;
  }

  toggleCollapsed()
  {
    this.collapsed = !this.collapsed;
  }

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;

  @ViewChild('imagesCarousel', {static : true}) imagesCarousel: NgbCarousel;

  togglePaused()
  {
    if (this.paused)
    {
      this.imagesCarousel.cycle();
    } else
      {
      this.imagesCarousel.pause();
    }
    this.paused = !this.paused;
  }

  calculateAverageRating()
  {
    if (this.ratings.length!==0)
    {
      this.ratings.forEach
      (
        (rating)=>
        {
          this.averageRecipeRating=this.averageRecipeRating+rating.ratingValue;
        }
      );
      this.averageRecipeRating= +(this.averageRecipeRating/this.ratings.length).toFixed(1);
    }
    else
    {
      this.averageRecipeRating = "";
    }
  }

  onImageSlide(slideEvent: NgbSlideEvent)
  {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT))
    {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR)
    {
      this.togglePaused();
    }
  }

  onImageLeft()
  {
    this.imagesCarousel.prev();
  }

  onImageRight()
  {
    this.imagesCarousel.next();
  }

  @ViewChild('videosCarousel', {static : true}) videosCarousel: NgbCarousel;

  onVideoLeft()
  {
    this.videosCarousel.prev();
  }

  onVideoRight()
  {
    this.videosCarousel.next();
  }

  onGoBack()
  {
    this.router.navigate(['']);
  }

  loginClicked()
  {
    const modalReference = this.modalService.open
    (
      LoginComponent,
      {centered : true}
    );
  }

  itemClicked(ingredient:string)
  {
    if (this.authService.getIsAuth())
    {
     this.shoppingListService.addItemToShoppingList(ingredient)
        .subscribe
        (
          (response)=>
          {
            if (response.updatedData.nModified === 1 || response.updatedData.upserted)
            {
              this.notificationService.show(ingredient+" added to your shopping list", { classname: 'bg-success text-light font-weight-bold', delay: 5000 })
            }
            else
            {
              this.notificationService.show(ingredient+" already exists in your shopping list", { classname: 'bg-warning text-light font-weight-bold', delay: 5000 })
            }
          }
        )
    }
  }

  ngOnDestroy()
  {
    this.ratingsSubscription.unsubscribe();
  }
}
