import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component
(
  {
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
  }
)
export class InfoComponent implements OnInit
{
  @Input() headerText;
  @Input() content;

  constructor(public activeModal : NgbActiveModal)
  {

  }

  ngOnInit()
  {

  }

}
