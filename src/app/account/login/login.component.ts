import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TecnotrelloService } from 'src/app/views/tecnotrello.service';
import { AccountService } from './../shared/account.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login = {
    email: '',
    password: ''
  }


  constructor(
    private accountservice: AccountService,
    private router: Router,
    private tecnotrelloService: TecnotrelloService
  ) { }

  ngOnInit(): void {
  }

  async onSubmit(){
    try {
      const result = await this.accountservice.login(this.login)
      
      window.localStorage.setItem('actualEmail', this.login.email)
      
      setTimeout(() => {
        this.tecnotrelloService.deleteDatas()
      }, 500)
      
      //volto para a rota vazia novamente
      this.router.navigate(['home'])      
    } catch (error) {
      alert('Email ou senha Inválidos!')
      
    }
  }
  
}
