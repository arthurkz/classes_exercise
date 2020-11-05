import { HttpClient } from '@angular/common/http';
import { TecnotrelloService } from './../tecnotrello.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import * as XLSX from 'xlsx'
import { AccountService } from 'src/app/account/shared/account.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})


export class HomeComponent implements OnInit {

  resultJson = 'https://tecnotrello-apiexcel.herokuapp.com/ldExport'
  infoTecnotrello: any = {
    contrato: '',
    os: '',
  }

  constructor(public tecnotrelloService: TecnotrelloService, private http: HttpClient, private accountService: AccountService) { }

  ngOnInit(): void {
    var input = document.getElementById('input')
    var spinner = document.getElementById('modal')
    
      input.addEventListener("change", (event: any) => {
        setTimeout(() => {
          spinner.style.display = 'block'
          let selectedFile = event.target.files[0]

          let resultObject: any
          if (selectedFile) {

            let fileReader = new FileReader();
            fileReader.readAsBinaryString(selectedFile)
            fileReader.onload = (event: any) => {



              let data = event.target.result
              let workbook = XLSX.read(data, { type: "binary" });
              workbook.SheetNames.forEach(sheet => {
                resultObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
              })

              this.tecnotrelloService.create(resultObject).subscribe()


              setTimeout(() => {
                spinner.style.display = 'none'
              }, 20000)
            }
          }
        }, 1000)

      })
  }

  fillAllTrello() {
    document.getElementById('modal').style.display = 'block'
    let getUsers = new XMLHttpRequest()
    getUsers.overrideMimeType('application/json')
    getUsers.open('get', `${environment.api}/users`, true)
    getUsers.onload = () => {
      let dataUsers = JSON.parse(getUsers.responseText)
      let actualEmail = window.localStorage.getItem('actualEmail')


      for (let i = 0; i < dataUsers.length; i++) {
        if (actualEmail === dataUsers[i].email) {
          let keyTrello = dataUsers[i].keyTrello
          let tokenTrello = dataUsers[i].tokenTrello

          this.tecnotrelloService.createBoard(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
    
    
          setTimeout(() => {
            this.tecnotrelloService.createLists(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          }, 3000)

          setTimeout(() => {
            this.tecnotrelloService.createCustomFields(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          }, 5000)


          setTimeout(() => {
            this.tecnotrelloService.createCards(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          },8000)  

          setTimeout(() => {
            this.tecnotrelloService.createLabels(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          },25000)  
          
          setTimeout(() => {
            this.tecnotrelloService.fillCustomFields(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          },35000)
        }
      }
    }
    getUsers.send()
    

    setTimeout(() => {
      document.getElementById('modal').style.display = 'none'
      alert("O Trello já foi totalmente preenchido!")
    },50000)
  }

  updateTrello(){
    document.getElementById('modal').style.display = 'block'

    

    let getUsers = new XMLHttpRequest()
    getUsers.overrideMimeType('application/json')
    getUsers.open('get', `${environment.api}/users`, true)
    getUsers.onload = () => {
      let dataUsers = JSON.parse(getUsers.responseText)
      let actualEmail = window.localStorage.getItem('actualEmail')


      for (let i = 0; i < dataUsers.length; i++) {
        if (actualEmail === dataUsers[i].email) {
          let keyTrello = dataUsers[i].keyTrello
          let tokenTrello = dataUsers[i].tokenTrello

          this.tecnotrelloService.updateCards(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          

          setTimeout(() => {
            this.tecnotrelloService.fillCustomFields(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          }, 8000)

          setTimeout(() => {
            this.tecnotrelloService.moveCardsOnBoard(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          }, 10000)

        }
      }
    }
    getUsers.send()

    

    setTimeout(() => {
      document.getElementById('modal').style.display = 'none'
      alert("Trello Atualizado com Sucesso!")
    },30000)
  }

  newFill() {
    this.tecnotrelloService.deleteDatas()
    setTimeout(() => {
      window.location.reload()
    }, 600)
  }

  fillNewCards(){
    document.getElementById('modal').style.display = 'block'

    let getUsers = new XMLHttpRequest()
    getUsers.overrideMimeType('application/json')
    getUsers.open('get', `${environment.api}/users`, true)
    getUsers.onload = () => {
      let dataUsers = JSON.parse(getUsers.responseText)
      let actualEmail = window.localStorage.getItem('actualEmail')


      for (let i = 0; i < dataUsers.length; i++) {
        if (actualEmail === dataUsers[i].email) {
          let keyTrello = dataUsers[i].keyTrello
          let tokenTrello = dataUsers[i].tokenTrello

          this.tecnotrelloService.newCards(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)

          setTimeout(() => {
            this.tecnotrelloService.fillCustomFields(this.infoTecnotrello.contrato, this.infoTecnotrello.os, keyTrello, tokenTrello)
          }, 8000)
        }
      }
    }
    getUsers.send()

    setTimeout(() => {
      document.getElementById('modal').style.display = 'none'
      alert("Trello Atualizado com Sucesso!")
    },30000)
  }

  logOff() {
    this.tecnotrelloService.deleteDatas()

    window.localStorage.removeItem('token')
    window.localStorage.removeItem('actualEmail')


    window.location.reload()
  }


}
