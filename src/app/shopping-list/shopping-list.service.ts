import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.backend_URL

@Injectable
(
  {
    providedIn : 'root'
  }
)
export class ShoppingListService
{
  constructor(private authService : AuthService, private http : HttpClient,private router : Router)
  {

  }

  public addItemToShoppingList(item:string)
  {
    const shoppingItem =
      {
        userId : this.authService.getLoggedInId(),
        item
      };

    return this.http.post<{message : string, updatedData : any}>(BACKEND_URL + '/user/addShoppingListItem', shoppingItem);
  }

  public getShoppingListItems(userId : string)
  {
    return this.http.get<{message : string, data : {userId : string, items : [string]}}>(BACKEND_URL + `/user/getShoppingListItems/${userId}`);
  }

  public removeShoppingListItem(userId : string, item : string)
  {
    return this.http.delete<{message : string , updatedData : any}>(BACKEND_URL + `/user/removeShoppingListItem/${userId}/${item}`)
  }
}
