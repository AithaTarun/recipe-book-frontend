import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from '../../info/info.component';

@Component
(
  {
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
  }
)
export class ActivateAccountComponent implements OnInit
{

  constructor(private authService:AuthService,
              private route : ActivatedRoute,
              private router : Router,
              private modalService : NgbModal)
  {

  }

  public message : string;

  ngOnInit()
  {
    this.route.paramMap.subscribe
    (
      (paramMap:ParamMap)=>
      {
        this.authService.activateAccount(paramMap.get("id"))
          .subscribe
          (
            (result)=>
            {
              this.message=result.message;

              const modalReference = this.modalService.open
              (
                InfoComponent
              );
              modalReference.componentInstance.headerText = 'Account Activation'
              modalReference.componentInstance.content = this.message;

              this.router.navigate(['/']);
            }
          );
      }
    )
  }

}
