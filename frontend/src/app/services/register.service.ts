import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import UserRegister from '../models/viewmodels/UserRegister';
import { Config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  public url:string;
  constructor(private _http: HttpClient) {
    this.url = Config.url;
  }

  Register(user:UserRegister):Observable<any>{
    let json = JSON.stringify(user);
    let headers = new HttpHeaders({'Content-Type':'aplication/json'});
    
    return this._http.post(this.url + "register",json,{headers: headers});
  }
}