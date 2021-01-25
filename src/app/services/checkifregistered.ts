import { LandingComponent } from '../landing/landing.component';
export function CheckIfRegisteredOnWelcome(component: LandingComponent): boolean {
  if (component.isRegistered) {
    return true;
  }
  else {
    window.alert('Need to enter first and last name');
  }
}
