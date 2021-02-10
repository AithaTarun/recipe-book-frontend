import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from '../info/info.component';
import {Router} from '@angular/router';

@Component
(
  {
  selector: 'app-invalid-route',
  templateUrl: './invalid-route.component.html',
  styleUrls: ['./invalid-route.component.css']
  }
)
export class InvalidRouteComponent implements OnInit
{

  constructor(private modalService : NgbModal,private router : Router)
  {

  }

  ngOnInit()
  {
    const modalReference = this.modalService.open
    (
      InfoComponent
    );
    modalReference.componentInstance.headerText = '404 not found'
    modalReference.componentInstance.content = 'Invalid route (404)';

    this.router.navigate(['/']);
  }

}
