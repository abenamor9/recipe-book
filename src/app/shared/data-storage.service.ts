import {Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {UserModel} from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private authenticatedUserInfo: UserModel;
  constructor(private httpClient: HttpClient, private recipeService: RecipeService,
              private authService: AuthService) { }


  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put('https://ng-recipe-app-5ee93.firebaseio.com/recipes.json', recipes).subscribe(
       (response) => {
         console.log(response);
       }
     );
  }

  getRecipes() {
    // we return an observable
    return this.httpClient.get< Recipe[] >('https://ng-recipe-app-5ee93.firebaseio.com/recipes.json')
      .pipe(map(
        (response: Recipe[]) => {
          return response.map(
            (recipe) => {
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} ;
            }
          );
        }) , tap(
        (response) => {
          this.recipeService.updateRecipes(response) ;
        }
        )
      );
  }
}
