import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from "@angular/forms";
import {
  HistoryCreditService,
  IClient,
} from "../services/history-credit.service";
import { ActivatedRoute } from "@angular/router";
import { SocketService } from "../socket.service";

@Component({
  selector: "app-simulator-credit",
  templateUrl: "./simulator-credit.component.html",
  styleUrls: ["./simulator-credit.component.scss"],
})
export class SimulatorCreditComponent implements OnInit {
  public title = "simulator-credit";

  public statusSimulation: number = 1;
  public currentLead;
  public resultSimulation;
  public formFinancial: FormGroup;
  public formLead: FormGroup;
  public showTerms: boolean = false;
  public acceptTerms: boolean = false;

  public emails: any[] = [];
  public typeId: any[] = [];
  public gender: any[] = [];
  public pagaduries: any[] = [];
  public typeClients: any[] = [];
  public typeOfContracts: any[] = [];
  public typeOfCredit: any[] = [];
  parentSocket;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private history: HistoryCreditService,
    private socket: SocketService
  ) {
    this.formLead = this.fb.group({
      nombre: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required, this.ValidateUrl.bind(this)])],
      telefono: ["", Validators.compose([Validators.required])],
      domain: ["", Validators.compose([Validators.required])],
    });

    this.formFinancial = this.fb.group({
      id_pagaduria: ["", Validators.compose([Validators.required])],
      id_tipo_cliente: ["", Validators.compose([Validators.required])],
      id_tipo_contrato: ["", Validators.compose([Validators.required])],
      fecha_inicio_labores: ["", Validators.compose([Validators.required])],
      salario_basico: ["", Validators.compose([Validators.required])],
      // otros_ingresos: ["", Validators.compose([Validators.required])],
      // dto_volante_nomina: ["", Validators.compose([Validators.required])],
      // compra_volante_nomina: ["", Validators.compose([Validators.required])],
    });

    this.parentSocket = this.route.snapshot.paramMap.get("socket");
  }

  ngOnInit() {
    this.getTypeId();
    this.getGender();
    this.getEmails();
    this.getPaying();
    this.getEmails()
    this.socket.setSize(this.parentSocket, this.getSize());
    window.addEventListener("resize", this.onresize.bind(this));
  }

  onresize() {
    this.socket.setSize(this.parentSocket, document.body.clientHeight);
  }

  getSize() {
    return window.outerHeight
  }

  getTypeId() {
    this.history.getTypeId().subscribe((data) => {
      this.typeId = data;
    });
  }

  getGender() {
    this.history.getGender().subscribe((data) => {
      this.gender = data;
    });
  }

  getEmails() {
    this.history.getEmials().subscribe((data) => {
      this.emails = data;
    });
  }

  getPaying() {
    this.history.getPaying().subscribe((Response) => {
      console.log(Response);
      this.pagaduries = Response;
    });
  }

  getTypeClient() {
    this.history
      .getTypeClient({
        pagaduria: parseInt(this.formFinancial.controls["id_pagaduria"].value),
      })
      .subscribe(
        (data) => {
          this.typeClients = data;
        },
        (err) => {
          this.typeClients = [];
        }
      );
  }

  getTypeOfContracts() {
    this.history
      .getTypeContracts({
        pagaduria: parseInt(this.formFinancial.controls["id_pagaduria"].value),
        tipo_cliente: parseInt(
          this.formFinancial.controls["id_tipo_cliente"].value
        ),
      })
      .subscribe(
        (data) => {
          this.typeOfContracts = data;
        },
        (err) => {
          this.typeClients = [];
        }
      );
  }

  saveLead() {
    this.formLead.markAllAsTouched()
    if (!this.formLead.valid) {
      this.socket.setSize(this.parentSocket, this.getSize());
      return;
    }
    const data = {
      ...this.formLead.value,
      email: this.formLead.controls.email.value + this.formLead.controls.domain.value
    }
    this.history.saveLead(data).subscribe((response) => {
      this.currentLead = response.idlead;
      this.statusSimulation = 2;
      this.socket.setSize(this.parentSocket, this.getSize());
    });
  }

  saveSimulationLead() {
    this.formFinancial.markAllAsTouched()
    if (!this.formFinancial.valid) {
      return;
    }

    this.history
      .saveSimulationLead({
        id_pagaduria: parseInt(this.formFinancial.controls.id_pagaduria.value),
        id_tipo_cliente: parseInt(
          this.formFinancial.controls.id_tipo_cliente.value
        ),
        id_tipo_contrato: parseInt(
          this.formFinancial.controls.id_tipo_contrato.value
        ),
        fecha_inicio_labores: this.history.buildDate(
          this.formFinancial.controls.fecha_inicio_labores.value
        ),
        salario_basico: parseInt(
          this.formFinancial.controls.salario_basico.value.replace(/,/g, "")
        ),
        idlead: parseInt(this.currentLead),
      })
      .subscribe((response) => {
        if (response.code != "200") {
          return alert(response.message);
        }
        this.resultSimulation = response;
        this.statusSimulation = 3;
        this.socket.setSize(this.parentSocket, this.getSize());
      });
  }

  backPage() {
    if (this.statusSimulation > 1) {
      if (this.statusSimulation == 3) {
        this.resultSimulation = null;
      }
      this.statusSimulation--;
      this.socket.setSize(this.parentSocket, this.getSize());
    } else {
      this.goToHome();
    }
  }

  changeTerms() {
    if (this.acceptTerms) {
      this.showTerms = true;
      this.acceptTerms = false;
    }
  }

  goToHome() {
    window.top.location.href = "https://www.finexus.com.co";
  }

  currency(control, form = "formFinancial") {
    console.log(form);
    this[form].controls[control].setValue(
      this[form].controls[control].value
        .replace(/,/g, "")
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  }


  ValidateUrl(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    if (control.value.indexOf('@') > 0) {
      return { validEmail: true };
    }
    return null;
  }
}
