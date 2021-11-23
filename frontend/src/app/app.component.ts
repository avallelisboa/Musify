import { Component, OnInit } from '@angular/core';
import User from './models/User';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public title = 'Musify';
  public user:User;
  public token;
  public errorMessage:string = "";

  constructor(
    private _userService:UserService
  ){
    this.user = new User('','','','','','','');
    this.token = '';
  }

  ngOnInit():void{
    let user = this._userService.CheckSession();
    if (user.name != '')
      this.user = user; 
  }

  userEvent(value:User): void{
    this.user = value;
  }
  tokenEvent(value:string): void{
    this.token = value;
  }
  errorMessageEvent(value:string): void{
    this.errorMessage =  value;
  }

  logoutEvent(value:string): void{
    this.token = value;
    
    this.user._id = '';
    this.user.name = '';
    this.user.lastname = '';
    this.user.email = '';
    this.user.password = '';
    this.user.role = '';
  }
}
