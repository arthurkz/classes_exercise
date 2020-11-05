import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from "jwt-decode"
import { environment } from 'src/environments/environment'




@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  async login(user:any){
    const result = await this.http.post<any>(`${environment.api}/auth/login`, user).toPromise()
    if(result && result.acess_token){
      window.localStorage.setItem('token', result.acess_token)
      return true
    }
    return false
  }

  async createAccount(account:any){
    const result = await this.http.post<any>(`${environment.api}/users`, account).toPromise()
    return result
  }

  getAuthorizationToken() {
    const token = window.localStorage.getItem('token')
    return token
  }

  getTokenExpirationDate(token: string): Date {
    let decoded: any = jwt_decode(token)

    if(decoded.exp === undefined){
      return null
    }

    const date = new Date(0)
    date.setUTCSeconds(decoded.exp)
    return date
  }

  isTokenExpired(token?: string): boolean{
    if (!token) {
      return true
    }

    const date = this.getTokenExpirationDate(token)
    if (date === undefined) {
      return false
    }

    return !(date.valueOf() > new Date().valueOf())
  }

  isUserLoggedIn() {
    const token = this.getAuthorizationToken()
    
    if (!token) {
      return false
    } else if (this.isTokenExpired(token)) {
      return false
    }

    return true
  }
}
