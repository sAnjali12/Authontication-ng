import { Injectable } from '@angular/core';
import { Observable,of} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserData{
    Username: string
    Email:string
    Password: string
    exp: number
}

interface TokenResponse {
    token: string
}

export interface TokenPayload {
    _id: string
    Username: string
    Email: string
    Password: string
}

export interface Logindata {
    Username: string
    Password: string
}

@Injectable()
export class AuthService {
    private token: string

    constructor(private http: HttpClient, private router: Router) {}

    private saveToken(token: string): void {
        localStorage.setItem('usertoken', token)
        this.token = token
    }

    private getToken(): string {
        if(!this.token){
            this.token =  localStorage.getItem('usertoken')
        }
        return this.token
    }

    public getUserData(): UserData {
        const token =  this.getToken()
        if(token) {
            return JSON.parse(atob(token.split('.')[1]));
        }else{
            return null
        }
    }

    public isLoggedIn(): boolean {
        const user = this.getUserData()
        if(user) {
            return user.exp > Date.now() / 1000
        }else{
            return false
        }
    }

    public register(user: TokenPayload): Observable<any> {
                const base =  this.http.post('http://localhost:3000/users/register', user)

                const request = base.pipe(
                    map((data: TokenResponse)=>{
                        if(data.token){
                            this.saveToken(data.token)
                        }
                        return data
                    })
                )
                return request
            }

    public login(userLogin: Logindata): Observable<any> {
        const base =  this.http.post('http://localhost:3000/users/login', userLogin)
        const request = base.pipe(
            map((data)=>{
                console.log(data)
                if(data){
                    // data['token'] = data
                    // this.saveToken(data)
                }
                return data
            })
        )
        return request
    }
    
    public profile(): Observable<any> {
        return this.http.get('http://localhost:3000/user/profile', {
            headers: {Authorization: `${this.getToken()}`}
        })
    }

    public logout(): void {
        this.token = ""
        window.localStorage.removeItem('userToken')
        this.router.navigateByUrl('/')
    }
}

