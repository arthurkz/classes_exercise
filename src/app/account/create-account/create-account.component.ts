import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../shared/account.service'


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  account = {
    name: '',
    email: '',
    password: '',
    keyTrello: '',
    tokenTrello: ''
  }


  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  async onSubmit(){
    try {
      const result = await this.accountService.createAccount(this.account)

      this.router.navigate(['/login'])
      // exibir a mensagem de sucesso
      alert("Sua conta no Tecnotrello foi criada com sucesso!")
      
      
    } catch (error) {
      alert("Verifique se os campos de Token/Key foram preenchidos de forma correta!")
      
    }
  }

}
