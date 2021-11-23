import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import UserLogin from '../models/viewmodels/UserLogin';
import { Config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _url:string;

  constructor(private _http:HttpClient) {
    this._url = Config.url;
  }

  Login(user:UserLogin) : Observable<any>{
    let json = JSON.stringify(user);
    let headers = new HttpHeaders({'Content-Type':'application/json'});

    return this._http.post(this._url + "login",json,{headers: headers});
  }
}
