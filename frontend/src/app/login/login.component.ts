import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import User from '../models/User';
import UserLogin from '../models/viewmodels/UserLogin';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers:[LoginService],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() userEvent = new EventEmitter<User>();
  @Output() tokenEvent = new EventEmitter<string>();
  @Output() errorMessageEvent = new EventEmitter<string>();

  public shouldShowRegistrationModal: boolean = false;
  public user:UserLogin = new UserLogin("","");
  constructor(
    private _loginService:LoginService
  ){}

  ngOnInit(): void {
  }

  ShouldShowRegistrationModal(): void{
      this.shouldShowRegistrationModal = !this.shouldShowRegistrationModal;
  }
  shouldCloseEvent(value: boolean): void{
    this.shouldShowRegistrationModal = value;
  }

  Login(): void{
    this.errorMessageEvent.emit('');
      let sub = this._loginService.Login(this.user).subscribe({
      next: (res)=>{
        let response = JSON.parse(res);

        let user = response.user;
        let token = response.token;

        this.userEvent.emit(user);
        this.tokenEvent.emit(token);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      },
      error: (err)=>{
        this.errorMessageEvent.emit(err);
      },
      complete: ()=>{
        this.user.email ='';
        this.user.password ='';

        sub.unsubscribe();
      }
    });   
    
  }

}
