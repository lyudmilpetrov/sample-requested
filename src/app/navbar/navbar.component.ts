import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RegisterUser } from '../services/register.service';
import { IUser } from '../shared/data.models';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  User: IUser;
  currentUserSubscription: Subscription;
  constructor(
    public rs: RegisterUser
  ) {
    this.currentUserSubscription = this.rs.currentUser.subscribe(user => {
      this.User = user;
    });
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }
}
