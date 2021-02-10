import {Component, TemplateRef} from '@angular/core';

import {NotificationsService} from './notifications.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  host: {'[class.ngb-toasts]': 'true'}
})
export class NotificationComponent
{
  constructor(public notificationService: NotificationsService)
  {

  }

  isTemplate(toast)
  {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
