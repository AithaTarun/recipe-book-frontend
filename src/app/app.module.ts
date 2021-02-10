import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { InfoComponent } from './info/info.component';
import {ErrorInterceptor} from './error.interceptor';
import {AuthInterceptor} from './auth/auth.interceptor';
import { InvalidRouteComponent } from './invalid-route/invalid-route.component';
import {ReactiveFormsModule} from '@angular/forms';
import {EmbedVideo} from 'ngx-embed-video';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import {NotificationComponent} from './notification/notification.component';

@NgModule
(
  {
    declarations:
      [
        AppComponent,
        HeaderComponent,
        InfoComponent,
        InvalidRouteComponent,
        ConfirmationComponent,
        NotificationComponent
      ],
  imports:
    [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,

    AppRoutingModule,
    //Auth module is not required.

    EmbedVideo.forRoot(),

      NgbDropdownModule
    ],
  providers:
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi: true
      },
    ],
  bootstrap:
    [
      AppComponent
    ],
    exports:
      [

      ],
  entryComponents:
    [
      InfoComponent,
      ConfirmationComponent
    ]
})
export class AppModule { }
