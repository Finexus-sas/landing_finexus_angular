import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import {
  HistoryCreditService,
  IClient,
} from "../services/history-credit.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  public formContact: FormGroup;
  public typeId: any[] = [];
  acceptTerms: boolean = false;

  constructor(private fb: FormBuilder, private history: HistoryCreditService) {
    this.formContact = this.fb.group({
      nombre: ["", Validators.compose([Validators.required])],
      tipo_identificacion: ["", Validators.compose([Validators.required])],
      identificacion: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      telefono: ["", Validators.compose([Validators.required])],
      tiempo: ["De 0 a 15 minutos", Validators.compose([Validators.required])],
    });
    // nombre: "Juan",
    //   tipo_identificacion: 1,
    //   identificacion: 1052065786,
    //   email: "ag@dominio.com",
    //   telefono: 31074458134,
    //   tiempo: "De 0 a 15 minutos",
  }

  ngOnInit() {
    this.getTypeId();
  }

  getTypeId() {
    this.history.getTypeId().subscribe((data) => {
      this.typeId = data;
    });
  }

  saveContact() {
    console.log(this.formContact.controls.tipo_identificacion.value);
    this.history
      .saveContact({
        ...this.formContact.value,
        tipo_identificacion: parseInt(
          this.formContact.controls.tipo_identificacion.value
        ),
        telefono: parseInt(this.formContact.controls.telefono.value),
      })
      .subscribe((data) => {
        this.formContact.reset();
        alert("Datos enviados correctamente");
      });
  }

  backPage() {
    this.goToHome();
  }

  goToHome() {
    window.top.location.href = "https://www.finexus.com.co";
  }
}
