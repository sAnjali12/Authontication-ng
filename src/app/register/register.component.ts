import { Component } from '@angular/core';
import { AuthService, TokenPayload } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  credentials: TokenPayload = {
    _id: '',
    Username: '',
    Email: '',
    Password: ''
   
  }
  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/login')
      },
      err => {
        console.error(err)
      }
    )
  }
}




  

  
