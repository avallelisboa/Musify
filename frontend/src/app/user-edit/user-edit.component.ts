import { Component, OnInit } from '@angular/core';
import User from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  public user:User = new User('','','','','','','');
  constructor(
    private _userService: UserService
  ) { 
    let loc = localStorage.getItem("user");
    let user:User;
    if (loc) user = JSON.parse(loc) as User;
  }

  ngOnInit(): void {
  }
  
  EditUser():void{

  }
}
