import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterUser } from '../services/register.service';
import { IUser } from '../shared/data.models';
@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  User: IUser;
  currentUserSubscription: Subscription;
  FirstName = new FormControl('', [Validators.required]);
  LastName = new FormControl('', [Validators.required]);
  EnterForm = new FormGroup({
    FirstName: this.FirstName,
    LastName: this.LastName
  });
  isRegistered = false;
  constructor(
    private rs: RegisterUser,
    private router: Router
  ) {
    this.currentUserSubscription = this.rs.currentUser.subscribe(user => {
      this.User = user;
    });
  }
  ngOnInit() { }
  ngAfterViewInit() { }
  ngOnDestroy() {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }
  SaveProfile(user: IUser) {
    if (this.EnterForm.valid) {
      this.isRegistered = true;
      this.rs.changeCurrentUser(user);
      this.router.navigateByUrl('chart-js-sample-line');
    }
  }

}
