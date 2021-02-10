import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoppingListService} from './shopping-list.service';
import {AuthService} from '../auth/auth.service';
import {map} from 'rxjs/operators';
import {NotificationsService} from '../notification/notifications.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit
{
  public items = [];
  highlighted : string;

  isLoading = false;

  constructor(private route : ActivatedRoute , private router : Router, private shoppingListService : ShoppingListService,
              private authService : AuthService, private notificationService : NotificationsService)
  {

  }

  ngOnInit()
  {
    this.isLoading = true;

    this.shoppingListService.getShoppingListItems(this.authService.getLoggedInId())
      .pipe
      (
        map(
          (response)=>
          {
            return response.data.items.map
            (
              (item)=>
              {
                return item.charAt(0).toUpperCase() + item.substr(1)
              }
            )
          }
        )
      )
      .subscribe
      (
        (items)=>
        {
          this.items = items
        }
      );

    this.isLoading = false;
  }

  flipkartSearchLink = "https://www.flipkart.com/search?q=";
  amazonSearchLink = "https://www.amazon.in/s?k="

  getLink(link, item)
  {
    return link + item.split(" ").join("+")
  }

  removeItem(item:string)
  {
    this.isLoading = true;

    const index = this.items.indexOf(item);

    this.shoppingListService.removeShoppingListItem(this.authService.getLoggedInId(), item.split(" ").join("+"))
      .subscribe
      (
        (response)=>
        {
          if (response.updatedData.nModified === 1)
          {
            this.items.splice(index, 1);
            this.notificationService.show(item+" removed from your shopping list", { classname: 'bg-success text-light font-weight-bold', delay: 5000 })
          }
          else
          {
            this.notificationService.show("Deleting item failed", { classname: 'bg-danger text-light font-weight-bold', delay: 5000 })
          }
        }
      );

    this.isLoading = false;
  }

  onGoBack()
  {
    this.router.navigate(['']);
  }
}
