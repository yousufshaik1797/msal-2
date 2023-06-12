import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
profile:any
constructor(private _profileService:ProfileService){}
getProfile(){
  this._profileService.getProfile().subscribe((data:any)=>{
    console.log(data);
    this.profile=data;
  })
}
}
