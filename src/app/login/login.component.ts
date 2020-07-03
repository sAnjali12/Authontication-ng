import { Component } from '@angular/core';
import { AuthService, Logindata } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  credentials: Logindata = {
    Username: '',
    Password: ''
  }

  constructor(private auth:AuthService, private router:Router) { }

  login(){
    console.log(this.credentials)
    this.auth.login(this.credentials).subscribe(
      ()=>{
        this.router.navigateByUrl('/profile');
      },
      err =>{
        console.log(err)


      }
    )
  }

}
