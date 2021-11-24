import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import UserRegister from '../models/viewmodels/UserRegister';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [RegisterService],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @Output() shouldCloseEvent = new EventEmitter<boolean>();

  public user:UserRegister = new UserRegister('','','','','','');
  constructor(
    private _registerService:RegisterService
    ) { }

  ngOnInit(): void {
  }
  CloseModal(): void{
    this.shouldCloseEvent.emit(false);
  }
  Register(): void{
    let sub = this._registerService.Register(this.user).subscribe({
      next: (res)=>{
        console.log(res);
      },
      error: (error)=>{
        console.log(error);
      },
      complete: ()=>{
        this.user.name = '';
        this.user.lastname = '';
        this.user.email ='';
        this.user.username ='';
        this.user.password ='';

        sub.unsubscribe();
        this.CloseModal();
      }
    });
  }

}
