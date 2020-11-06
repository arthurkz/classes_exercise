import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { catchError, elementAt } from 'rxjs/operators';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class TecnotrelloService {

  login = {
    email: '',
    password: ''
  }

  baseUrl = "https://cors-anywhere.herokuapp.com/https://tecnotrello-apiexcel.herokuapp.com/ldExport"

  constructor(private snackBar: MatSnackBar, public http: HttpClient) { }


  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }

  convertData(serial: number) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate()),
      day = date.getDate().toString(),
      dayF = (day.length == 1) ? '0' + day : day,
      month = (date.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      monthF = (month.length == 1) ? '0' + month : month,
      yearF = date.getFullYear();
    return yearF + "-" + monthF + "-" + dayF + "T14:00:00.000Z";
  }

  create(ldexport: any) {
    return this.http.post(this.baseUrl, ldexport)
  }

  createBoard(contrato: any, os: any, key: string, token: string) {
    let project = `${contrato}-${os}`
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    let getBoards = new XMLHttpRequest()
    getBoards.overrideMimeType("application/json")
    getBoards.open("GET", urlGetBoards, true)
    getBoards.onload = () => {
      let dataBoards
      try {
        dataBoards = JSON.parse(getBoards.responseText)
      } catch (error) {
        alert("O Token/Key não foi inserido corretamente! Tente gera-los novamente!")
        window.location.reload()
      }

      let cont = 0
      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          cont++
        }
      }

      if (cont === 0) {
        let urlCreateBoard = `https://api.trello.com/1/boards/?key=${key}&token=${token}&name=${project}&defaultLists=false`


        let getBoards = new XMLHttpRequest()
        getBoards.open("POST", urlCreateBoard, true)
        getBoards.send(null)
      }
    }
    getBoards.send(null)
  }

  createLists(contrato: any, os: any, key: string, token: string) {
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    let project = `${contrato}-${os}`
    let boards = new XMLHttpRequest()
    boards.overrideMimeType("application/json")
    boards.open('GET', urlGetBoards, true)
    boards.onload = () => {
      let dataBoards = JSON.parse(boards.responseText)


      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          let idBoard = dataBoards[i].id
          let urlGetList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`

          let getList = new XMLHttpRequest()
          getList.overrideMimeType("application/json")
          getList.open('GET', urlGetList, true)
          getList.onload = () => {
            let dataGetLists = JSON.parse(getList.responseText)

            let notExistList = dataGetLists == ""
            let urlList : string
            boards = new XMLHttpRequest()
            if (notExistList) {
              // XMLHttp Request para criação de uma Lista no Trello

              urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=LD&pos=16`
              boards.open('POST', urlList, false)
              boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=PENDENCIAS&pos=32`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=REFERENCIAS / PEND .RESOLV&pos=64`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=CANCELADOS&pos=128`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=PRODUÇÃO&pos=256`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=TRABALHANDO&pos=512`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=EMITIR&pos=1024`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=EMITIDO - AGUARDANDO COMENTÁRIOS&pos=2048`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=COMENTADO&pos=4096`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=APROVADO&pos=8192`
                boards.open('POST', urlList, false)
                boards.send(null)

                urlList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}&name=GRDs&pos=16384`
                boards.open('POST', urlList, false)
                boards.send(null)
            }

          }
          getList.send(null)
        }
      }
    }

    boards.send(null)
  }

  createCustomFields(contrato: any, os: any, key: string, token: string){
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    let project = `${contrato}-${os}`
    let boards = new XMLHttpRequest()
    boards.overrideMimeType("application/json")
    boards.open('get', urlGetBoards, true)
    boards.onload = () => {
      let dataBoards = JSON.parse(boards.responseText)


      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          let idBoard = dataBoards[i].id
          let idPlugin = "56d5e249a98895a9797bebb9"
          let urlEnableCustomField = `https://api.trello.com/1/boards/${idBoard}/boardPlugins?key=${key}&token=${token}&idPlugin=${idPlugin}`

          let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`
          let getCards = new XMLHttpRequest()
          getCards.overrideMimeType("application/json")
          getCards.open('get', urlGetCards)
          getCards.onload = () => {
            let dataCards = JSON.parse(getCards.responseText)

            if (dataCards[0] == undefined) {
              let postPowerUp = new XMLHttpRequest()
              postPowerUp.open("post", urlEnableCustomField, true)
              postPowerUp.send()

              setTimeout(() => {
                let urlCreateCustomField: string

                urlCreateCustomField = `https://api.trello.com/1/customFields?key=${key}&token=${token}&idModel=${idBoard}&modelType=board&name=NUM. CLIENTE&type=text`
                postPowerUp.open("post", urlCreateCustomField, false)
                postPowerUp.send()

                urlCreateCustomField = `https://api.trello.com/1/customFields?key=${key}&token=${token}&idModel=${idBoard}&modelType=board&name=REV./T.E.&type=text`
                postPowerUp.open("post", urlCreateCustomField, false)
                postPowerUp.send()

                urlCreateCustomField = `https://api.trello.com/1/customFields?key=${key}&token=${token}&idModel=${idBoard}&modelType=board&name=MARCO&type=text`
                postPowerUp.open("post", urlCreateCustomField, false)
                postPowerUp.send()

                urlCreateCustomField = `https://api.trello.com/1/customFields?key=${key}&token=${token}&idModel=${idBoard}&modelType=board&name=RESPONSAVEL&type=text`
                postPowerUp.open("post", urlCreateCustomField, false)
                postPowerUp.send()

                urlCreateCustomField = `https://api.trello.com/1/customFields?key=${key}&token=${token}&idModel=${idBoard}&modelType=board&name=STATUS&type=text`
                postPowerUp.open("post", urlCreateCustomField, false)
                postPowerUp.send()

                urlCreateCustomField = `https://api.trello.com/1/customFields?key=${key}&token=${token}&idModel=${idBoard}&modelType=board&name=FORMATO&type=text`
                postPowerUp.open("post", urlCreateCustomField, false)
                postPowerUp.send()

                urlCreateCustomField = `https://api.trello.com/1/customFields?key=${key}&token=${token}&idModel=${idBoard}&modelType=board&name=GRD ATUAL&type=text`
                postPowerUp.open("post", urlCreateCustomField, false)
                postPowerUp.send()
              }, 500)
            }
          }
          getCards.send()
        }
      }
    }
    boards.send()
  }

  createCards(contrato: any, os: any, key: string, token: string) {
    let project = `${contrato}-${os}`
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    const board = new XMLHttpRequest()
    const list = new XMLHttpRequest()
    const httpRequest = new XMLHttpRequest()
    const cardRequest = new XMLHttpRequest()


    board.overrideMimeType("application/json")
    board.open('get', urlGetBoards)
    board.onload = () => {
      let dataBoards = JSON.parse(board.responseText)

      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          let idBoard = dataBoards[i].id        
          // Verificação para preenchimento de novos cards
          
          let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`

          let getCards = new XMLHttpRequest()
          getCards.overrideMimeType('application/json')
          getCards.open('get', urlGetCards)
          getCards.onload = () => {
            let dataCards = JSON.parse(getCards.responseText)

            if(dataCards[0] != undefined){
              alert("Já existe CARTÕES nesse QUADRO!Caso queira inserir NOVOS CARTÕES, clique no botão INSERIR NOVOS CARTÕES")
              window.location.reload()

            } else {
              let getList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
              list.overrideMimeType("application/json")
              list.open('get', getList)
              list.onload = () => {
                let dataLists = JSON.parse(list.responseText)      
                    
                for (let i = 0; i < dataLists.length; i++) {
                  if (dataLists[i].name == "LD") {                            
                    // Pegar meu result JSON e criar todos os cards com o elemento "NumTecnomin"
                    httpRequest.overrideMimeType("application/json")
                    httpRequest.open('get', this.baseUrl + '/1')
                    httpRequest.onload = () => {
                      let dataResultJson = JSON.parse(httpRequest.responseText)
                      let idList = dataLists[i].id
                      
                      for (let i = 0; i < dataResultJson.length; i++) {
                          
                          setTimeout(() => {
                            if (dataResultJson[i].NumTecnomin.indexOf(project) === 0) {
                              let cardDate
                              if (dataResultJson[i].hasOwnProperty('TerminoRepr')) {
                                cardDate = this.convertData(Number(dataResultJson[i].TerminoRepr))
                              } else if (dataResultJson[i].hasOwnProperty('InicioRepr')) {
                                cardDate = this.convertData(Number(dataResultJson[i].InicioRepr))
                              } else if (dataResultJson[i].hasOwnProperty('TerminoBaseline')) {
                                cardDate = this.convertData(Number(dataResultJson[i].TerminoBaseline))
                              } else {
                                cardDate = ""
                              }
                              
                              let cardName = `${dataResultJson[i].NumTecnomin}`
                              let cardDescription = dataResultJson[i].Descricao
                              let urlCreateCard = `https://api.trello.com/1/cards?key=${key}&token=${token}&idList=${idList}&name=${cardName}&desc=${cardDescription}&due=${cardDate}`
                              cardRequest.open('post', urlCreateCard,false)
                              cardRequest.send()
                            }
                          },200)
                        }
                      }
                      httpRequest.send()    
                    }
                  }      
              }         
              list.send()
            }
          }
          getCards.send()          
        }
      }    
    }
    board.send()
  }

  createLabels(contrato: any, os: any, key: string, token: string) {
    let project = `${contrato}-${os}`
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    let boards = new XMLHttpRequest()
    boards.overrideMimeType("application/json")
    boards.open('get', urlGetBoards, true)
    boards.onload = () => {
      let dataBoards = JSON.parse(boards.responseText)

      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          let idBoard = dataBoards[i].id
          let resultJson = new XMLHttpRequest()
          resultJson.overrideMimeType('application/json')
          resultJson.open('get', this.baseUrl + '/1', true)
          resultJson.onload = () => {
            let dataJson = JSON.parse(resultJson.responseText)


            for (let i = 0; i < dataJson.length; i++) {
              if (dataJson[i].NumTecnomin.indexOf(project) === 0) {
                let disciplina: string         
                let nameTecnomin = `${dataJson[i].NumTecnomin}`
                disciplina = dataJson[i].Disciplina.toUpperCase()

                let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`
                let getCards = new XMLHttpRequest()
                getCards.overrideMimeType('application/json')
                getCards.open("get", urlGetCards, true)
                getCards.onload = () => {
                  let dataCards = JSON.parse(getCards.responseText)


                  for (let contCard = 0; contCard < dataCards.length; contCard++) {
                    let nameCard = dataCards[contCard].name

                    if (nameCard == nameTecnomin) {
                      let idCard = dataCards[contCard].id
                      let urlCreateLabel = `https://api.trello.com/1/cards/${idCard}/labels?key=${key}&token=${token}&color=green&name=${disciplina}`
                      let postLabel = new XMLHttpRequest()
                      postLabel.open("post", urlCreateLabel, true)
                      postLabel.send()
                    }

                  }
                }
                getCards.send()
              }
            }
          }
          resultJson.send()
        }
      }
    }
    boards.send()
  }

  fillCustomFields(contrato: any, os: any, key: string, token: string) {
    let project = `${contrato}-${os}`
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    let boards = new XMLHttpRequest()
    boards.overrideMimeType("application/json")
    boards.open('GET', urlGetBoards, true)
    boards.onload = () => {
      let dataBoards = JSON.parse(boards.responseText)

      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          let idBoard = dataBoards[i].id
          let getList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
          let list = new XMLHttpRequest()
          list.overrideMimeType("application/json")
          list.open('GET', getList, true)
          list.onload = () => {
            let dataLists = JSON.parse(list.responseText)

            for (let i = 0; i < dataLists.length; i++) {
              if (dataLists[i].name == "LD") {
                let resultJson = new XMLHttpRequest()
                resultJson.overrideMimeType("application/json")
                resultJson.open('GET', this.baseUrl + '/1')
                resultJson.onload = () => {
                  let dataJson = JSON.parse(resultJson.responseText)

                  for (let i = 0; i < dataJson.length; i++) {
                    let nameTecnomin = `${dataJson[i].NumTecnomin}`

                    if (dataJson[i].NumTecnomin.indexOf(project) === 0) {

                      let numVale = `${dataJson[i].NumCliente}`
                      let revDocument 
                      let executante
                      let formato
                      let marco
                      let status
                      let grd


                      if (dataJson[i].hasOwnProperty('RevAtual')) {
                        revDocument = dataJson[i].RevAtual
                      } else {
                        revDocument = "A"
                      }

                      if (dataJson[i].hasOwnProperty('Executante')) {
                        executante = dataJson[i].Executante.toUpperCase()
                      } else {
                        executante = ""
                      }

                      if (dataJson[i].hasOwnProperty('Formato')) {
                        formato = dataJson[i].Formato.toUpperCase()
                      } else {
                        formato = ""
                      }

                      if (dataJson[i].hasOwnProperty('Marco')) {
                        marco = dataJson[i].Marco.toUpperCase()
                      } else {
                        marco = ""
                      }

                      if (dataJson[i].hasOwnProperty('StatusRetornoAtual')) {
                        status = dataJson[i].StatusRetornoAtual.toUpperCase()
                      } else {
                        status = ""
                      }

                      if (dataJson[i].hasOwnProperty('GRDEmissaoAtual')) {
                        grd = dataJson[i].GRDEmissaoAtual
                      } else {
                        grd = ""
                      }



                      let bodyRevDocument = {value:{text:revDocument}}
                      let bodyNumVale = {value:{text:numVale}}
                      let bodyExecutante = {value:{text:executante}}
                      let bodyFormato = {value:{text:formato}}
                      let bodyMarco = {value:{text:marco}}
                      let bodyStatus = {value:{text:status}}
                      let bodyGRD = {value:{text:grd}}


                      let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`
                      let getCards = new XMLHttpRequest()
                      getCards.overrideMimeType('application/json')
                      getCards.open("GET", urlGetCards)
                      getCards.onload = () => {
                        let dataCards = JSON.parse(getCards.responseText)
                      
                        for (let contCard = 0; contCard < dataCards.length; contCard++) {
                          let nameCard = dataCards[contCard].name

                          if (nameCard === nameTecnomin) {
                            let idCard = dataCards[contCard].id
                            // Atualizar o Custom Field de Número Vale
                            let getCustomFields = new XMLHttpRequest()
                            let urlGetCustomFields = `https://api.trello.com/1/boards/${idBoard}/customFields?key=${key}&token=${token}`
                            getCustomFields.overrideMimeType("application/json")
                            getCustomFields.open("get", urlGetCustomFields)
                            getCustomFields.onload = () => {
                              let dataCustomFields = JSON.parse(getCustomFields.responseText)
                              let idCustomField
                              let urlUpdateCustomField
                              let putCustomField = new XMLHttpRequest()


                              for(let i = 0; i < dataCustomFields.length; i++){

                                switch (dataCustomFields[i].name) {
                                  case "NUM. CLIENTE":
                                    idCustomField = dataCustomFields[i].id
                                    urlUpdateCustomField = `https://api.trello.com/1/cards/${idCard}/customField/${idCustomField}/item?key=${key}&token=${token}`
                                    putCustomField.open("put", urlUpdateCustomField,false)
                                    putCustomField.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                                    putCustomField.send(JSON.stringify(bodyNumVale))
                                    break;
                                  case "REV./T.E.":
                                    idCustomField = dataCustomFields[i].id
                                    urlUpdateCustomField = `https://api.trello.com/1/cards/${idCard}/customField/${idCustomField}/item?key=${key}&token=${token}`
                                    putCustomField.open("put", urlUpdateCustomField,false)
                                    putCustomField.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                                    putCustomField.send(JSON.stringify(bodyRevDocument))
                                    break
                                  case "MARCO":
                                    idCustomField = dataCustomFields[i].id
                                    urlUpdateCustomField = `https://api.trello.com/1/cards/${idCard}/customField/${idCustomField}/item?key=${key}&token=${token}`
                                    putCustomField.open("put", urlUpdateCustomField,false)
                                    putCustomField.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                                    putCustomField.send(JSON.stringify(bodyMarco))
                                  break
                                  case "RESPONSAVEL":
                                    idCustomField = dataCustomFields[i].id
                                    urlUpdateCustomField = `https://api.trello.com/1/cards/${idCard}/customField/${idCustomField}/item?key=${key}&token=${token}`
                                    putCustomField.open("put", urlUpdateCustomField,false)
                                    putCustomField.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                                    putCustomField.send(JSON.stringify(bodyExecutante))
                                  break
                                  case "FORMATO":
                                    idCustomField = dataCustomFields[i].id
                                    urlUpdateCustomField = `https://api.trello.com/1/cards/${idCard}/customField/${idCustomField}/item?key=${key}&token=${token}`
                                    putCustomField.open("put", urlUpdateCustomField,false)
                                    putCustomField.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                                    putCustomField.send(JSON.stringify(bodyFormato))
                                  break;
                                  case "GRD ATUAL":
                                    idCustomField = dataCustomFields[i].id
                                    urlUpdateCustomField = `https://api.trello.com/1/cards/${idCard}/customField/${idCustomField}/item?key=${key}&token=${token}`
                                    putCustomField.open("put", urlUpdateCustomField,false)
                                    putCustomField.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                                    putCustomField.send(JSON.stringify(bodyGRD))
                                  break;
                                  default:
                                    idCustomField = dataCustomFields[i].id
                                    urlUpdateCustomField = `https://api.trello.com/1/cards/${idCard}/customField/${idCustomField}/item?key=${key}&token=${token}`
                                    putCustomField.open("put", urlUpdateCustomField,false)
                                    putCustomField.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                                    putCustomField.send(JSON.stringify(bodyStatus))
                                  break;
                                }
                              }
                            
                            }
                            getCustomFields.send()
                          }
                        }
                      }
                      getCards.send()

                    }
                  }
                }
                resultJson.send()
                       
              }
            }
          }
          list.send()
        }
      }
    }
    boards.send(null)
  }

  newCards(contrato: any, os: any, key: string, token: string){
    let project = `${contrato}-${os}`
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    const board = new XMLHttpRequest()
    const cardRequest = new XMLHttpRequest()


    board.overrideMimeType("application/json")
    board.open('get', urlGetBoards)
    board.onload = () => {
      let dataBoards = JSON.parse(board.responseText)


      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          let idBoard = dataBoards[i].id
          let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`

          let httpRequest = new XMLHttpRequest()
          httpRequest.overrideMimeType('application/json')
          httpRequest.open('get', urlGetCards)
          httpRequest.onload = () => {
            let dataCards = JSON.parse(httpRequest.responseText)
          
            let resultJson = new XMLHttpRequest()
            resultJson.overrideMimeType('application/json')
            resultJson.open('get', this.baseUrl + '/1')
            resultJson.onload = () => {
              let dataJson = JSON.parse(resultJson.responseText)
              
              for (let i = 0; i < dataJson.length; i++) {
                if (dataJson[i].NumTecnomin.indexOf(project) === 0){
                  let nameJson = dataJson[i].NumTecnomin                 
                  let findCard = false
                  

                  for (let j = 0; j < dataCards.length; j++) {
                    if (nameJson == dataCards[j].name) {
                      findCard = true
                    } 
                  }

                  if (!findCard) {
                    let getList = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
                    let list = new XMLHttpRequest()
                    list.overrideMimeType("application/json")
                    list.open('get', getList)
                    list.onload = () => {
                      let dataLists = JSON.parse(list.responseText)                                                    
                      let idList = dataLists[0].id

                      let cardDate
                      if (dataJson[i].hasOwnProperty('TerminoRepr')) {
                        cardDate = this.convertData(Number(dataJson[i].TerminoRepr))
                      } else if (dataJson[i].hasOwnProperty('InicioRepr')) {
                        cardDate = this.convertData(Number(dataJson[i].InicioRepr))
                      } else if (dataJson[i].hasOwnProperty('TerminoBaseline')) {
                        cardDate = this.convertData(Number(dataJson[i].TerminoBaseline))
                      } else {
                        cardDate = ""
                      }
                          
                      let cardName = nameJson
                      let cardDescription = dataJson[i].Descricao
                      let urlCreateCard = `https://api.trello.com/1/cards?key=${key}&token=${token}&idList=${idList}&name=${cardName}&desc=${cardDescription}&due=${cardDate}`
                      cardRequest.open('post', urlCreateCard,false)
                      cardRequest.send()

                      let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`
                      let getCards = new XMLHttpRequest()
                      getCards.overrideMimeType('application/json')
                      getCards.open("get", urlGetCards, false)
                      getCards.onload = () => {
                        let dataCards = JSON.parse(getCards.responseText)


                        for (let contCard = 0; contCard < dataCards.length; contCard++) {
                          if (dataCards[contCard].name == nameJson) {
                            let disciplina = dataJson[i].Disciplina.toUpperCase()
                            let idCard = dataCards[contCard].id
                            let urlCreateLabel = `https://api.trello.com/1/cards/${idCard}/labels?key=${key}&token=${token}&color=green&name=${disciplina}`
                            let postLabel = new XMLHttpRequest()
                            postLabel.open("post", urlCreateLabel, false)
                            postLabel.send()

                            break
                          }
                        }
                      
                      }
                      getCards.send()

                    }
                    list.send()
                  }

                }
              }
            }
            resultJson.send()            
          }
          httpRequest.send()
        }
      }
    }
    board.send()


  }

  updateCards(contrato: any, os: any, key: string, token: string){
    document.getElementById('modal').style.display = 'block'
    let project = `${contrato}-${os}`
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    const board = new XMLHttpRequest()
    let contBoard = 0

    board.overrideMimeType("application/json")
    board.open('get', urlGetBoards)
    board.onload = () => {
      let dataBoards = JSON.parse(board.responseText)

      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          contBoard++
          let idBoard = dataBoards[i].id
          // Verificação para preenchimento de novos cards
          let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`
          let getCards = new XMLHttpRequest()
          getCards.overrideMimeType("application/json")
          getCards.open('get', urlGetCards)
          getCards.onload = () => {
            let dataCards = JSON.parse(getCards.responseText)

            
            let resultJson = new XMLHttpRequest
            resultJson.overrideMimeType("application/json")
            resultJson.open('get', this.baseUrl + '/1')
            resultJson.onload = () => {
              let dataJson = JSON.parse(resultJson.responseText)
              for (let j = 0; j < dataJson.length; j++) {
                if (dataJson[j].NumTecnomin.indexOf(project) === 0) {
    
                  for (let i = 0; i < dataCards.length; i++) {
                    if(dataCards[i].name == dataJson[j].NumTecnomin){
                      let cardId = dataCards[i].id
                      let cardDate
                      let cardDescription = dataJson[j].Descricao

                      if (dataJson[j].hasOwnProperty('TerminoRepr')) {
                        cardDate = this.convertData(Number(dataJson[j].TerminoRepr))
                      } else if (dataJson[j].hasOwnProperty('InicioRepr')) {
                        cardDate = this.convertData(Number(dataJson[j].InicioRepr))
                      } else if (dataJson[j].hasOwnProperty('TerminoBaseline')) {
                        cardDate = this.convertData(Number(dataJson[j].TerminoBaseline))
                      } 

                      let urlUpdateCard = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&desc=${cardDescription}&due=${cardDate}`
                      getCards.open('put', urlUpdateCard,false)
                      getCards.send()
                   }
                  }
                }
              }
              resultJson.send()
            }
              
          }
          getCards.send()
        }  
      }

      if(contBoard == 0){
        alert("O quadro do Contrato/Os selecionado não existe em seu Trello!")
        document.getElementById('modal').style.display = 'none'
      }
    }
    board.send()
  }

  moveCardsOnBoard(contrato: any, os: any, key: string, token: string) {
    let project = `${contrato}-${os}`
    let urlGetBoards = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`
    let httpRequest = new XMLHttpRequest()
    httpRequest.overrideMimeType("application/json")
    httpRequest.open('get', urlGetBoards, true)
    httpRequest.onload = () => {
      let dataBoards = JSON.parse(httpRequest.responseText)

      for (let i = 0; i < dataBoards.length; i++) {
        if (dataBoards[i].name == project) {
          let idBoard = dataBoards[i].id
          let urlGetCards = `https://api.trello.com/1/boards/${idBoard}/cards?key=${key}&token=${token}`
          let getCards = new XMLHttpRequest()
          getCards.overrideMimeType("application/json")
          getCards.open("get", urlGetCards)
          getCards.onload = () => {
            let dataCards = JSON.parse(getCards.responseText)

            for (let i = 0; i < dataCards.length; i++) {
              let cardId = dataCards[i].id
              let urlCustomFieldsCard = `https://api.trello.com/1/cards/${cardId}/customFieldItems?key=${key}&token=${token}`
              let getCustomFields = new XMLHttpRequest()
              getCustomFields.overrideMimeType("application/json")
              getCustomFields.open("get", urlCustomFieldsCard)
              getCustomFields.onload = () => {
                let dataCustomFields = JSON.parse(getCustomFields.responseText)

                for (let i = 0; i < dataCustomFields.length; i++) {
                  if (dataCustomFields[i].value.text == "0") {
                    let urlGetLists = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
                    let list = new XMLHttpRequest()
                    list.overrideMimeType("application/json")
                    list.open("get", urlGetLists, false)
                    list.onload = () => {
                      let dataLists = JSON.parse(list.responseText)

                      for(let j = 0; j < dataLists.length; j++){
                        if (dataLists[j].name == "APROVADO") {
                          let listId = dataLists[j].id
                          let urlUpdateCard = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&idList=${listId}&dueComplete=true`
                          setTimeout(() => {
                            getCards.open('put', urlUpdateCard, false)
                            getCards.send()
                          }, 100)
                        }
                      }                    
                    }
                    list.send()
                  } 
                  else if (dataCustomFields[i].value.text == "A" || dataCustomFields[i].value.text == "B" || dataCustomFields[i].value.text == "C" || dataCustomFields[i].value.text == "D" || dataCustomFields[i].value.text == "E" || dataCustomFields[i].value.text == "F" || dataCustomFields[i].value.text == "G"){
                    for (let i = 0; i < dataCustomFields.length; i++){
                      if (dataCustomFields[i].value.text == "APROVADO C/ COMENTÁRIOS") {
                        let urlGetLists = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
                        let list = new XMLHttpRequest()
                        list.overrideMimeType("application/json")
                        list.open("get", urlGetLists, false)
                        list.onload = () => {
                        let dataLists = JSON.parse(list.responseText)

                        for(let j = 0; j < dataLists.length; j++){
                          if (dataLists[j].name == "COMENTADO") {
                            let listId = dataLists[j].id
                            let urlUpdateCard = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&idList=${listId}`
                            
                            setTimeout(() => {
                              getCards.open('put', urlUpdateCard, false)
                              getCards.send()
                            },100)

                            }
                          }                    
                        }
                        list.send()
                      } else if (dataCustomFields[i].value.text == "APROVADO"){
                        let urlGetLists = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
                        let list = new XMLHttpRequest()
                        list.overrideMimeType("application/json")
                        list.open("get", urlGetLists, false)
                        list.onload = () => {
                        let dataLists = JSON.parse(list.responseText)

                        for(let j = 0; j < dataLists.length; j++){
                          if (dataLists[j].name == "COMENTADO") {
                            let listId = dataLists[j].id
                            let urlUpdateCard = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&idList=${listId}`
                            
                            setTimeout(() => {
                              getCards.open('put', urlUpdateCard, false)
                              getCards.send()
                            },100)
                            
                            }
                          }                    
                        }
                        list.send()
                      } else if(dataCustomFields[i].value.text == "NÃO APROVADO"){
                        let urlGetLists = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
                        let list = new XMLHttpRequest()
                        list.overrideMimeType("application/json")
                        list.open("get", urlGetLists, false)
                        list.onload = () => {
                        let dataLists = JSON.parse(list.responseText)

                        for(let j = 0; j < dataLists.length; j++){
                          if (dataLists[j].name == "COMENTADO") {
                            let listId = dataLists[j].id
                            let urlUpdateCard = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&idList=${listId}`
                            
                            setTimeout(() => {
                              getCards.open('put', urlUpdateCard, false)
                              getCards.send()
                            },100)

                            }
                          }                    
                        }
                        list.send()
                      }
                    }
                  }
                  else if(dataCustomFields[i].value.text == "A"){
                      let resultJson = new XMLHttpRequest()
                      resultJson.overrideMimeType("application/json")
                      resultJson.open("get", this.baseUrl+'/1')
                      resultJson.onload = () => {
                        let dataJson = JSON.parse(resultJson.responseText)

                        for (let i = 0; i < dataJson.length; i++) {
                          if (dataJson[i].NumTecnomin.indexOf(project) === 0 && dataJson[i].hasOwnProperty('GRDEmissaoAtual')) {
                            let urlGetLists = `https://api.trello.com/1/boards/${idBoard}/lists?key=${key}&token=${token}`
                            let list = new XMLHttpRequest()
                            list.overrideMimeType("application/json")
                            list.open("get", urlGetLists, false)
                            list.onload = () => {
                            let dataLists = JSON.parse(list.responseText)

                            for(let j = 0; j < dataLists.length; j++){
                              if (dataLists[j].name == "EMITIDO - AGUARDANDO COMENTÁRIOS") {
                                let listId = dataLists[j].id
                                let urlUpdateCard = `https://api.trello.com/1/cards/${cardId}?key=${key}&token=${token}&idList=${listId}`
                                
                                setTimeout(() => {
                                  getCards.open('put', urlUpdateCard, false)
                                  getCards.send()
                                },100)
                                }
                              }                    
                            }
                            list.send()
                          }
                        }
                      }
                      resultJson.send()
                    }
                  }              
                }
                getCustomFields.send()
              }
            }
            getCards.send()
            
          }
        }
      }
      httpRequest.send()
  
  
  }



  deleteDatas() {
    try{
      let rawFile = new XMLHttpRequest()
      rawFile.overrideMimeType("application/json")
      rawFile.open("DELETE", this.baseUrl + '/1', true)
      rawFile.send(null)
    } catch(err){
      console.log(err);
    }
  }





}

