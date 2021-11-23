import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import User from '../models/User';
import { Config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _url:string;

  constructor(private _http:HttpClient) { 
    this._url = Config.url;
  }

  GetToken(): string{
    return localStorage.getItem("token") as string;
  }

  CheckSession():User{
    let stored = localStorage.getItem("user");

    if(stored != null){
      let user:User = JSON.parse(stored) as User;
      return user;
    }else return new User('','','','','','','');
  }

  UpdateUser(user:User):Observable<any>{
    let json = JSON.stringify(user);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization' : this.GetToken()
    });

    return this._http.put(this._url + "user", json, {headers: headers});
  }

}
