import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from './info/info.component';
import {throwError} from 'rxjs';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor
{

  constructor(private modalService : NgbModal)
  {

  }

  intercept(request:HttpRequest<any>,next:HttpHandler)
  {
    return next.handle(request)
      .pipe
      (
        catchError
        (
          (error : HttpErrorResponse)=>
          {
            console.log("Received Error : ",error);

            let errorMessage = 'Unknown Error Occurred';

            if (error.error.message)
            {
              errorMessage = error.error.message;
            }

            const modalReference = this.modalService.open
            (
              InfoComponent
            );
            modalReference.componentInstance.headerText = 'Error';
            modalReference.componentInstance.content = errorMessage;

            return throwError(error);
          }
        )
      )
  }

}
