export interface RecipeModel
{
  id : string,
  recipeName : string,
  description : string,
  procedureSteps : string[],
  categories : string[],
  imageData : any[],
  ingredients :
    [
      {
        ingredientName : string,
        quantity : string
      }
    ],
  videoURLs :
    [
      {
        url : string,
        language : string
      }
    ]
}

