import {Component, Input, OnInit} from '@angular/core';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {RecipesService} from '../../recipes.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit
{
  angryPlain="assets/Recipe%20Icons/Ratings/angry-plain.png";
  angrySolid="assets/Recipe%20Icons/Ratings/angry-solid.png";

  disappointedPlain="assets/Recipe%20Icons/Ratings/disappointed-plain.png";
  disappointedSolid="assets/Recipe%20Icons/Ratings/disappointed-solid.png";

  mehPlain="assets/Recipe%20Icons/Ratings/meh-plain.png";
  mehSolid="assets/Recipe%20Icons/Ratings/meh-solid.png";

  smilePlain="assets/Recipe%20Icons/Ratings/smile-plain.png";
  smileSolid="assets/Recipe%20Icons/Ratings/smile-solid.png";

  starPlain="assets/Recipe%20Icons/Ratings/star-plain.png";
  starSolid="assets/Recipe%20Icons/Ratings/star-solid.png";

  angrySRC = this.angryPlain
  disappointedSRC = this.disappointedPlain;
  mehSRC = this.mehPlain;
  smileSRC = this.smilePlain;
  starSRC = this.starPlain;

  ratingRadiosSRC =
    [
      this.angrySRC,this.disappointedSRC,this.mehSRC,this.smileSRC,this.starSRC
    ];
  ratingRadiosPlainSRC=
    [
      this.angryPlain,this.disappointedPlain,this.mehPlain,this.smilePlain,this.starPlain
    ];
  ratingRadiosSolidSRC=
    [
      this.angrySolid,this.disappointedSolid,this.mehSolid,this.smileSolid,this.starSolid
    ];

  tooltipMessages=
    [
      "Very bad",
      "Poor",
      "Ok",
      "Good",
      "Excellent"
    ];

  @Input() recipeId : string;

  constructor(private recipeService:RecipesService, private authService:AuthService)
  {

  }

  ngOnInit()
  {

  }

  onMouseMove(index:number)
  {
    if (!this.isClicked)
    {
      this.ratingRadiosSRC[index]=this.ratingRadiosSolidSRC[index];
    }
  }

  onMouseLeave(index:number)
  {
    if (!this.isClicked)
    {
      this.ratingRadiosSRC[index]=this.ratingRadiosPlainSRC[index];
    }
  }

  isClicked=false;
  isCommented=false;

  currentRating = 0;
  comment;

  clicked(index:number)
  {
    this.currentRating=index+1;

    this.isClicked=true;

    for (let i=0; i<this.ratingRadiosSRC.length; i++)
    {
      this.ratingRadiosSRC[i]=this.ratingRadiosPlainSRC[i];
    }

    this.ratingRadiosSRC[index]=this.ratingRadiosSolidSRC[index];
  }

  onCommented(e:HTMLTextAreaElement , pop:NgbPopover)
  {
    this.isCommented=true;

    this.comment=e.value;

    pop.close();

    this.recipeService.addNewRating
    (
      this.recipeId,
      {
        username : this.authService.getLoggedInUserName(),
        ratingValue : this.currentRating,
        comment : this.comment
      }
    );
  }

}
