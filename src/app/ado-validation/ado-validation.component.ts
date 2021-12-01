import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from "@angular/forms";
import { HistoryCreditService } from '../services/history-credit.service';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from "../socket.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-ado-validation',
  templateUrl: './ado-validation.component.html',
  styleUrls: ['./ado-validation.component.scss']
})
export class AdoValidationComponent implements OnInit {
  public status = 1;
  public formValidation: FormGroup;
  public errorForm: boolean = false;
  parentSocket;
  isCreditProcess: boolean = false;
  constructor(private fb: FormBuilder, private history: HistoryCreditService, private route: ActivatedRoute, private socket: SocketService, private router: Router) {
    this.formValidation = this.fb.group({
      identificacion: ["", Validators.compose([Validators.required])],
      nro_solicitud: ["", Validators.compose([Validators.required])],
    });

    const responseADO = this.route.snapshot.queryParamMap.get('_Response');
    this.isCreditProcess = localStorage.getItem('step1') ? JSON.parse(localStorage.getItem('step1')) : false;
    this.parentSocket = this.route.snapshot.paramMap.get("socket");
    console.log(responseADO)
    if (responseADO) {
      this.validateStatusEnrollMent(JSON.parse(responseADO))
    }

  }

  ngOnInit() {
    window.addEventListener("resize", this.onresize.bind(this));
    setTimeout(() => {
      this.socket.setSize(this.parentSocket, this.getSize());
    }, 500)
  }

  onresize() {
    this.socket.setSize(this.parentSocket, document.body.clientHeight);
  }

  get cc() {
    return this.formValidation.controls['identificacion'].value
  }


  async validateLastSuccessADO() {
    //await this.presentLoading()
    this.history.validateClientSuccess(this.cc)
      .subscribe(async data => {
        this.launchValidationOEnrolment(true, this.cc)
      }, async err => {
        this.launchValidationOEnrolment(false, this.cc)
      })
  }


  launchValidationOEnrolment(validation, cc) {

    window.top.location.href = 'https://adocolumbia.ado-tech.com/Finexus/validar-persona?callback=https://www.finexus.com.co/validacion-de-identidad&key=db92efc69991&projectName=Finexus'

  }

  getSize() {
    return document.body.clientHeight
  }

  async validateStatusEnrollMent(response) {
    const idState = parseInt(response.IdState)
    this.saveLogADO(response)

    if (idState != 2 && idState != 14 && idState != 1) {

      this.status = 2;
      return this.socket.setSize(this.parentSocket, this.getSize());
    }

    if (idState == 1) {
      return this.validateTransaction(response)

    }

    if (idState == 2 || idState == 14) {
      return this.history.validateClientSuccess(response.IdNumber)
        .subscribe(response => {
          this.status = 3
          return this.socket.setSize(this.parentSocket, this.getSize());
        })
    }
  }

  async validateStatusVerification(response) {
    const data = response.split(',')
    const idState = data[2].split(':')[1].replace('}', '')

    switch (parseInt(idState)) {
      case 10:
        return await alert("Estado de validación " + "Rostro no corresponde");

      case 11:
        return await alert("Estado de validación " + "Huella no corresponde");

      case 15:
        return await alert("Estado de validación " + "Ocurrio un error inesperado, intentalo nuevamente");

      case 14:
        this.history.validateClientSuccess(this.cc)
          .subscribe(response => {
            this.status = 3
          })
    }
  }

  validateTransaction(transaction) {
    this.status = 4;
    var timeOut = setTimeout(() => {
      clearInterval(interval)
      this.status = 2;
      alert("Estado de validación, No hubo respuesta por parte de la entidad de la validación")
    }, 480000)
    var interval = setInterval(() => {
      this.history.validateClientADO(transaction.IdNumber)
        .subscribe(async data => {
          console.log(data)
          if (data.Scores[0].Id == 2) {
            clearTimeout(timeOut)
            clearInterval(interval)
            this.status = 3
            this.socket.setSize(this.parentSocket, this.getSize());
            this.saveLogADO(data)
          } else {
            if (data.Scores[0].StateName != "Pendiente") {

              clearInterval(interval)
              clearTimeout(timeOut)
              this.status = 2;
              this.socket.setSize(this.parentSocket, this.getSize());
              this.saveLogADO(data)
            }
          }
        })
    }, 30000)


  }


  validateBussinees() {
    this.history.validateBussiness({
      identificacion: String(this.formValidation.controls['identificacion'].value),
      nro_solicitud: this.formValidation.controls['nro_solicitud'].value
    })
      .subscribe(response => {
        console.log(response.code)
        if (response.code == "200") {
          return this.validateLastSuccessADO()
        }

        this.errorForm = true;
      })
  }

  saveLogADO(data) {
    this.history.saveADOReponse({
      "identificacion": String(data.IdNumber),
      "json_ado": data
    })
      .subscribe(Response => {
        console.log('Saved log')
      })
  }



  goToHome() {
    window.top.location.href = "https://www.finexus.com.co";
  }

  goToICan() {
    if (this.isCreditProcess) {
      return this.router.navigate(['/request/' + this.parentSocket + '/creditApplication/2'])
    }
    window.top.location.href = "https://www.finexus.com.co/familia-empleado/";
  }

  newIntent() {
    if (this.isCreditProcess) {
      return window.top.location.href = "https://www.finexus.com.co/solicitud";
    }

    window.top.location.href = "https://www.finexus.com.co/validacion-de-identidad";
  }

}
