import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component
(
  {
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
  }
)
export class ConfirmationComponent implements OnInit
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
