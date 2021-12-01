import { Injectable } from '@angular/core';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpService) { }


  login(data: iLogin) {
    console.log('LOGIN')
    return this.http.post('/login/signin', data)
  }

  idValidate(){
    return this.http.post('/generic/request', { "resource": "/generic/request/valida-identidad" });
  }

  get user() {
    return JSON.parse(localStorage.getItem('user'))
  }

  set user(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }


  get token() {
    return localStorage.getItem('token')
  }

  set token(token) {
    localStorage.setItem('token', token)
  }
}




export interface iLogin {
  username: string;
  password: string;
}
