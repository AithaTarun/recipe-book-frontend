import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {RecipesService} from '../recipes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EmbedVideoService} from 'ngx-embed-video';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, AfterViewInit
{
  @ViewChild('labelImport') labelImport: ElementRef;
  @ViewChild('filesJumbo') filesJumbo : ElementRef;

  public mode = 'Create';
  private recipeId : string;

  loading = true;

  constructor(private recipesService : RecipesService,private router : Router, private route : ActivatedRoute,
              public embedVideoService:EmbedVideoService)
  {

  }

  form : FormGroup;

  recipeCategories = new FormArray
  (
    [
      new FormGroup
      (
        {
          'category' : new FormControl(null,Validators.required)
        }
      )
    ]
  );

  recipeIngredients = new FormArray
  (
    [
      new FormGroup
      (
        {
          'ingredientName' : new FormControl(null, Validators.required),
          'quantity' : new FormControl(null , Validators.required)
        }
      )
    ]
  );

  validateVideoURL = (control:FormControl)=>
  {
    if (control.value === null)
    {
      return null
    }
    else
      {
      try
      {
        this.embedVideoService.embed(control.value)
        return null
      }
      catch (e)
      {
        return {
          "Error": "Invalid video URL"
        }
      }
    }
  }

  recipeVideos = new FormArray
  (
    [
      new FormGroup
      (
        {
          'video' : new FormControl(null,[Validators.required, this.validateVideoURL]),
          'language' : new FormControl(null,Validators.required)
        }
      )
    ]
  );

  recipeProcedureSteps = new FormArray
  (
    [
      new FormGroup
      (
        {
          'step' : new FormControl(null,Validators.required)
        }
      )
    ]
  );

  images : any[] = [];

  ngOnInit()
  {
    let recipeName = '';
    let recipeDescription = '';

    this.form = new FormGroup
    (
      {
        'recipeName' : new FormControl
        (
          recipeName,Validators.required
        ),

        'description' : new FormControl
        (
          recipeDescription,Validators.required
        ),

        'procedureSteps' : this.recipeProcedureSteps,

        'categories' : this.recipeCategories,

        'images' : new FormControl
        (
          null,
              [
                Validators.required,
              ]
        ),

        'ingredients' : this.recipeIngredients,

        'videos' : this.recipeVideos
      }
    );

    this.route.paramMap.subscribe
    (
      (paramMap)=>
      {
        //If edit is selected :
        if (paramMap.has("id"))
        {
          this.mode = 'Edit';

          this.recipeId = paramMap.get('id');

          const recipe = this.recipesService.getRecipe(this.recipeId);
          this.loading = false;

          //Procedure Steps :
          this.recipeProcedureSteps.clear();
          recipe.procedureSteps.forEach
          (
            (step)=>
            {
              this.recipeProcedureSteps.push
              (
                new FormGroup
                (
                  {
                    'step' : new FormControl(step,Validators.required)
                  }
                )
              )
            }
          );

          //Categories :
          this.recipeCategories.clear();
          recipe.categories.forEach
          (
            (category)=>
            {
              this.recipeCategories.push
              (
                new FormGroup
                (
                  {
                    'category' : new FormControl(category,Validators.required)
                  }
                )
              )
            }
          );

          //Ingredients :
          this.recipeIngredients.clear();
          recipe.ingredients.forEach
          (
            (ingredient)=>
            {
              this.recipeIngredients.push
              (
                new FormGroup
                (
                  {
                    'ingredientName' : new FormControl(ingredient.ingredientName, Validators.required),
                    'quantity' : new FormControl(ingredient.quantity , Validators.required)
                  }
                )
              )
            }
          );

          //Videos :
          this.recipeVideos.clear();
          recipe.videoURLs.forEach
          (
            (video)=>
            {
              this.recipeVideos.push
              (
                new FormGroup
                (
                  {
                    'video' : new FormControl(video.url, [Validators.required, this.validateVideoURL]),
                    'language' : new FormControl(video.language,Validators.required)
                  }
                )
              )
            }
          );

          //Images :
          recipe.imageData.forEach
          (
            (image)=>
            {
              this.images.push(image);
            }
          );
          this.form.get('images').setValidators([this.imagesCountValidity(this.images.length)]);
          let sendImages = [];
          this.images.forEach
          (
            (image , index)=>
            {
              const data = image.data;
              const array = new Uint8Array(data);
              const blob = new Blob([array]);
              const file = new File([blob],"File" +index+1);

              sendImages.push(file);
            }
          );
          this.images = sendImages;

          this.form.patchValue
          (
            {
              "recipeName" : recipe.recipeName,
              "description" : recipe.description
            }
          );
        }
        else
        {
          this.mode = 'Create';
          this.recipeId = null;

          this.loading = false;
        }
      }
    )
  }

  ngAfterViewInit()
  {
    if (this.mode==="Edit")
    {
      this.labelImport.nativeElement.innerText=this.images.length + " file(s)";
    }
  }

  imagesCountValidity(count:number) : ValidatorFn
  {
    return (control:AbstractControl) : ValidationErrors | null =>
    {
      if (count===0)
      {
        return {
        invalidImagesCount : true
        }
      }
      return null
  }
};

  // Categories
  get categoryControls()
  {
    return (<FormArray>this.form.get('categories')).controls;
  }
  onAddCategory()
  {
    (<FormArray>this.form.get('categories')).push
    (
      new FormGroup
      (
        {
          'category' : new FormControl(null,Validators.required)
        }
      )
    )
  }
  onDeleteCategory(index : number)
  {
    if((<FormArray>this.form.get('categories')).length===1)
    {
      return;
    }
    (<FormArray>this.form.get('categories')).removeAt(index);
  }
  onDeleteAllCategories()
  {
    this.recipeCategories.clear();
    this.onAddCategory();
  }

  //Ingredients
  get ingredientControls()
  {
    return (<FormArray>this.form.get('ingredients')).controls;
  }

  onAddIngredient()
  {
    (<FormArray>this.form.get('ingredients')).push
    (
      new FormGroup
      (
        {
          'ingredientName' : new FormControl(null, Validators.required),
          'quantity' : new FormControl(null , Validators.required)
        }
      )
    )
  }
  onDeleteIngredient(index : number)
  {
    if((<FormArray>this.form.get('ingredients')).length===1)
    {
      return;
    }
    (<FormArray>this.form.get('ingredients')).removeAt(index);
  }
  onDeleteAllIngredients()
  {
    this.recipeIngredients.clear();
    this.onAddIngredient();
  }

  // Videos
  get videoControls()
  {
    return (<FormArray>this.form.get('videos')).controls;
  }
  onAddVideo()
  {
    (<FormArray>this.form.get('videos')).push
    (
      new FormGroup
      (
        {
          'video' : new FormControl(null, [Validators.required, this.validateVideoURL]),
          'language' : new FormControl(null,Validators.required)
        }
      )
    )
  }
  onDeleteVideo(index : number)
  {
    if((<FormArray>this.form.get('videos')).length===1)
    {
      return;
    }
    (<FormArray>this.form.get('videos')).removeAt(index);
  }
  onDeleteAllVideos()
  {
    this.recipeVideos.clear();
    this.onAddVideo();
  }

  // Procedure
  get procedureControls()
  {
    return (<FormArray>this.form.get('procedureSteps')).controls;
  }
  onAddProcedureStep()
  {
    (<FormArray>this.form.get('procedureSteps')).push
    (
      new FormGroup
      (
        {
          'step' : new FormControl(null,Validators.required)
        }
      )
    );
  }
  onDeleteProcedureStep(index : number)
  {
    if((<FormArray>this.form.get('procedureSteps')).length===1)
    {
      return;
    }
    (<FormArray>this.form.get('procedureSteps')).removeAt(index);
  }
  onDeleteAllProcedureSteps()
  {
    this.recipeProcedureSteps.clear();
    this.onAddProcedureStep();
  }

  onFileChange(event)
  {
    this.form.get('images').setValidators(Validators.required);

    this.images=[];

    if (event.target.files.length===0)
    {
      this.labelImport.nativeElement.innerText="Choose images";
      this.filesJumbo.nativeElement.innerText='';
      return;
    }

    for  (let i =  0; i < event.target.files.length; i++)
    {
      const fileType:string = event.target.files[i].type;
      if (!fileType.match("image/*"))
      {
        this.filesJumbo.nativeElement.innerText="Invalid file types";
        this.form.get('images').setErrors({invalidFileType : true});
        return;
      }

      this.images.push(event.target.files[i]);
    }
    const files:FileList = event.target.files;
    this.filesJumbo.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');

    this.labelImport.nativeElement.innerText=event.target.files.length + " file(s)";
  }

  onSubmit()
  {
    if (this.mode==="Create")
    {
      this.recipesService.addOrUpdateRecipe
      (
        this.form.get('recipeName').value,
        this.form.get("description").value,
        this.images,
        this.ingredientControls,
        this.categoryControls,
        this.procedureControls,
        this.videoControls
      );
    }
    else
    {
      this.recipesService.addOrUpdateRecipe
      (
        this.form.get('recipeName').value,
        this.form.get("description").value,
        this.images,
        this.ingredientControls,
        this.categoryControls,
        this.procedureControls,
        this.videoControls,
        this.recipeId
      );
    }
  }

  onReset()
  {
    this.form.reset();

    this.onDeleteAllCategories();
    this.onDeleteAllIngredients();
    this.onDeleteAllProcedureSteps();
    this.onDeleteAllVideos();

    this.images = [];
    this.labelImport.nativeElement.innerText="Choose images";
    this.filesJumbo.nativeElement.innerText='';
  }

  onCancel()
  {
    this.router.navigate(['']);
  }
}
