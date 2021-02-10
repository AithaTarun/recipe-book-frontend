import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from '../info/info.component';

import jwt_decode from 'jwt-decode';
import {RecipesService} from '../recipes/recipes.service';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.backend_URL

@Injectable
(
  {
    providedIn : 'root'
  }
)
export class AuthService
{
  private token : string;
  private authStatusListener = new Subject<boolean>(); //Used to push authentication information.

  private isAuthenticated = false;

  private tokenTimer : any;

  private isAdmin=false;

  constructor(private http:HttpClient, private router : Router,private modalService : NgbModal, public recipesService : RecipesService)
  {

  }

  createUser(username:string,email:string,password:string)
  {
    const authData : AuthData = {username,email,password};

    this.http
      .post
      (
        BACKEND_URL+'/user/signup',
        authData
      )
      .subscribe
      (
        (response)=>
        {
          const modalReference = this.modalService.open
          (
            InfoComponent
          );
          modalReference.componentInstance.headerText = 'Notification';
          modalReference.componentInstance.content = "Account created successfully, check you mail to activate account";

          //console.log("Response",response);

          this.router.navigate(['/']);
        }
      )
  }

  login(email: string,password: string)
  {
    const authData : AuthData = {username : null,email,password};

    this.http
      .post<{token:string,expiresIn:number}>
      (
        BACKEND_URL+'/user/login',
        authData
      )
      .subscribe
      (
        (response)=>
        {
          this.token=response.token;
          if (this.token)
          {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);

            this.authStatusListener.next(true);
            this.isAuthenticated = true;

            this.isAdmin = jwt_decode(this.token).username === 'admin';

            const now = new Date();
            const expirationDate = new Date(now.getTime()+expiresInDuration*1000);
            this.saveAuthData(this.token,expirationDate);

            this.recipesService.getFavouriteRecipes(this.getLoggedInId());

            this.router.navigate(['/']);
          }
        }
      );
  }

  activateAccount(activationID:string)
  {
    return this.http.put<{message:string}>
    (
      BACKEND_URL+"/user/activateAccount",
      {
        id:activationID
      }
    );
  }

  getToken()
  {
    return this.token;
  }

  getIsAdmin()
  {
    return this.isAdmin;
  }

  getAuthStatusListener()
  {
    return this.authStatusListener.asObservable();
    /*
    As observable because so we can't emit new values from other components,
    we only want to be able to emit from within the service but we want to be able to listen
    from other parts.
     */
  }

  getIsAuth()
  {
    return this.isAuthenticated;
  }

  logout()
  {
    this.token = null;
    this.isAuthenticated = false;

    this.authStatusListener.next(false);
    this.isAdmin=false;

    clearTimeout(this.tokenTimer);

    this.clearAuthData();

    this.router.navigate(['/']);

    this.recipesService.favouriteModeChanged(false);
  }

  private saveAuthData(token : string,expirationDate : Date)
  {
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
  }

  private clearAuthData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  autoAuthUser()
  {
    const authInformation = this.getAuthData();

    if (!authInformation)
    {
      return;
    }

    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn>0)
    {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);

      this.authStatusListener.next(true);
      this.isAdmin = jwt_decode(this.token).username === 'admin';
      this.recipesService.getFavouriteRecipes(this.getLoggedInId());
    }
  }

  private getAuthData()
  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate)
    {
      return;
    }

    return {
      token,
      expirationDate : new Date(expirationDate),
    }
  }

  private setAuthTimer(duration : number)
  {
    this.tokenTimer = setTimeout
    (
      ()=>
      {
        this.logout();
      },
      duration*1000 //Seconds -> Milliseconds.
    );
  }

  public getLoggedInUserName()
  {
    return jwt_decode(this.token).username;
  }

  public getLoggedInId()
  {
    return jwt_decode(this.token).userId;
  }
}
