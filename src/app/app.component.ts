import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LoginComponent } from './pages/login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonRouterOutlet, IonApp,LoginComponent],
})
export class AppComponent {
  constructor() {}
}
