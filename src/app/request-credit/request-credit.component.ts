import { Component, OnInit } from "@angular/core";
import {
  HistoryCreditService,
  IClient,
} from "../services/history-credit.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { SocketService } from "../socket.service";
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: "app-request-credit",
  templateUrl: "./request-credit.component.html",
  styleUrls: ["./request-credit.component.scss"],
})
export class RequestCreditComponent implements OnInit {
  title = "simulator-credit";

  statusSimulation: number = 1;

  helpList: any[] = [
    {
      title: "¿ Cómo se paga el crédito de débito por nómina?",
      text:
        "¡Fácil!, tu empleador lo deduce de tu pago mensual y el se encarga de pagarnos por ti.",
      expand: true,
    },
    {
      title: "¿ Puedo escoger la fecha en la que me descontarán la cuota de mi crédito ?",
      text:
        "Los créditos por descuento de nómina los deduce tu empleador en tus fechas de pagos habituales, así te lo ponemos fácil y sin complicaciones.",
      expand: false,
    },
    {
      title: "¿ Puedo hacer abonos extraordinarios a mi Crédito de descuento por nómina ?",
      text:
        "¡Obvio si, por supuesto! Te damos la oportunidad de hacer abonos en el momento que desees.",
      expand: false,
    },
    {
      title: "¿ Recibo un extracto mensual de mi Crédito de descuento por nómina ?",
      text:
        "Si deseas recibir tu extracto, puedes comunicarte con nosotros a través de nuestros canales de contacto y el extracto será enviado a tu correo electrónico registrado.",
      expand: false,
    },
  ];

  types_credits = "libre_inversion";

  showHelp: boolean = false;

  showAddItem: boolean = false;

  lead;

  public emails: any[] = [];
  public typeId: any[] = [];
  public gender: any[] = [];
  public pagaduries: any[] = [];
  public typeClients: any[] = [];
  public typeOfContracts: any[] = [];
  public typeOfCredit: any[] = [];
  public entitysMora: any[] = [];
  public entitys: any[] = [];
  public entitysAdded: any[] = [];

  public formBasicInfo: FormGroup;
  public formFinancial: FormGroup;
  public formAddWallet: FormGroup;

  public currentRequestNumber;
  public policy;

  tasaMayor;
  plazo;
  monto;
  tasas: any[] = [];
  months: any[] = [];
  files: any[] = [];
  cuota;
  parentSocket;
  stepUrl;
  constructor(
    private history: HistoryCreditService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private socket: SocketService,
    private router: Router
  ) {
    this.formBasicInfo = this.fb.group({
      tipo_identificacion: ["", Validators.compose([Validators.required])],
      identificacion: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.max(9999999999),
        ]),
      ],
      primer_apellido: [null, Validators.compose([Validators.required])],
      primer_nombre: [null, Validators.compose([Validators.required])],
      fecha_expedicion: [null, Validators.compose([Validators.required])],
      fecha_nacimiento: [null, Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required, this.ValidateUrl.bind(this)])],
      domain: ["", Validators.compose([Validators.required])],
      celular: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(999999999),
          Validators.max(9999999999),
        ]),
      ],
      genero: ["", Validators.compose([Validators.required])],
      // domain: ["", Validators.compose([Validators.required])],
    });

    this.formFinancial = this.fb.group({
      id_pagaduria: [null, Validators.compose([Validators.required])],
      id_tipo_cliente: ["", Validators.compose([Validators.required])],
      id_tipo_contrato: ["", Validators.compose([Validators.required])],
      //"id_tipo_credito": ["", Validators.compose([Validators.required])],
      fecha_inicio_labores: ["", Validators.compose([Validators.required])],
      salario_basico: ["", Validators.compose([Validators.required])],
      otros_ingresos: ["", Validators.compose([Validators.required])],
      dto_volante_nomina: ["", Validators.compose([Validators.required])],
      compra_volante_nomina: ["", Validators.compose([Validators.required])],
    });

    this.formAddWallet = this.fb.group({
      entidad: ["", Validators.compose([Validators.required])],
      numero: [null, Validators.compose([Validators.required])],
      saldo_actual: ["", Validators.compose([Validators.required])],
    });

    this.lead = this.route.snapshot.paramMap.get("currentLead");
    this.parentSocket = this.route.snapshot.paramMap.get("socket");

    this.stepUrl = this.route.snapshot.paramMap.get('step');
  }

  ngOnInit() {

    //this.cuota = this.policy.valor_cuota_aprox
    this.getTypeId();
    this.getGender();
    this.getEmails();
    this.getPaying();
    this.getTypeCredit();

    this.getFiles();


    // this.buildTasas();
    // this.buildMothsCount();
    // this.simulateV2()

    if (this.lead) {
      this.autoCompleteRequest();
    }

    console.log(parseInt(this.stepUrl))
    if (this.stepUrl) {
      this.statusSimulation = parseInt(this.stepUrl);
      this.fillStep1()
    } else {
      localStorage.removeItem('step1');
    }
    window.addEventListener("resize", this.onresize.bind(this));
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

  onresize() {
    this.socket.setSize(this.parentSocket, document.body.clientHeight);
  }

  getSize() {
    return document.body.clientHeight
  }


  getTypeId() {
    this.history.getTypeId().subscribe((data) => {
      this.typeId = data;
    });
  }

  getTypeCredit() {
    this.history.getTypeCredit().subscribe(
      (data) => {
        this.typeOfCredit = data;
        this.types_credits = this.typeOfCredit[0].id;
        this.socket.setSize(this.parentSocket, this.getSize());
      },
      (err) => {
        this.typeOfCredit = [];
      }
    );
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
          console.log(data);
          console.log(typeof data);
          this.typeOfContracts = data;
        },
        (err) => {
          this.typeClients = [];
        }
      );
  }

  autoCompleteRequest() {
    console.log(this.lead)
    this.history.autoCompleteRequest(this.lead).subscribe((data) => {
      console.log(data)
      this.fillFields(data);
    });
  }

  fillFields(fields) {
    let email = fields.email.split('@');
    let date = fields.fecha_inicio_labores.split('-')
    this.formBasicInfo.controls.tipo_identificacion.setValue("1");
    // this.formBasicInfo.controls.primer_nombre.setValue(fields.nombre);
    // this.formBasicInfo.controls.primer_apellido.setValue(fields.nombre);
    this.formBasicInfo.controls.email.setValue(email[0]);
    this.formBasicInfo.controls.domain.setValue("@" + email[1]);
    this.formBasicInfo.controls.celular.setValue(fields.telefono);

    this.formFinancial.controls.id_pagaduria.setValue(fields.id_pagaduria);
    this.formFinancial.controls.salario_basico.setValue(String(fields.salario_basico));
    this.formFinancial.controls.id_tipo_cliente.setValue(
      fields.id_tipo_cliente
    );
    this.formFinancial.controls.id_tipo_contrato.setValue(fields.id_tipo_contrato)


    this.getTypeClient()
    this.getTypeOfContracts()
    this.currency('salario_basico');

    // this.formFinancial.controls.fecha_inicio_labores.setValue(
    //   { year: date[0], month: date[2], day: date[1] }
    // );
  }

  saveBasicData() {
    this.formBasicInfo.markAllAsTouched()
    if (!this.formBasicInfo.valid) {
      this.socket.setSize(this.parentSocket, this.getSize());
      return;
    }
    this.history
      .saveStep1({
        ...this.formBasicInfo.value,
        email: this.formBasicInfo.controls.email.value + this.formBasicInfo.controls.domain.value,
        tipo_identificacion: parseInt(
          this.formBasicInfo.controls.tipo_identificacion.value
        ),
        genero: parseInt(this.formBasicInfo.controls.genero.value),
        fecha_expedicion: this.history.buildDate(
          this.formBasicInfo.controls.fecha_expedicion.value
        ),
        fecha_nacimiento: this.history.buildDate(
          this.formBasicInfo.controls.fecha_nacimiento.value
        ),
      })
      .subscribe((data) => {
        console.log(data);
        if (!data.code) {
          return alert("Ha ocurrido un error inesperado, intentelo nuevamente");
        }

        if (data.code != "200") {
          return alert(data.response);
        }
        this.currentRequestNumber = data.numero_solicitud;
        localStorage.setItem('numero_solicitud',this.currentRequestNumber);
        localStorage.setItem('step1', JSON.stringify(this.formBasicInfo.value))
        //this.statusSimulation = 2;
        //this.socket.setSize(this.parentSocket, this.getSize());
        //this.router.navigate(['/validacion-de-identidad/' + this.parentSocket + "/true"])
        window.top.location.href = 'https://adocolumbia.ado-tech.com/Finexus/validar-persona?callback=https://www.finexus.com.co/validacion-de-identidad&key=db92efc69991&projectName=Finexus'
      });
  }

  saveFinancialInfo() {
    //id_tipo_credito:
    this.formFinancial.markAllAsTouched()
    if (!this.formFinancial.valid) {
      this.socket.setSize(this.parentSocket, this.getSize());
      return;
    }
    const data = {
      id_tipo_credito: this.types_credits,
      numero_solicitud: parseInt(this.currentRequestNumber),
      id_pagaduria: parseInt(this.formFinancial.controls["id_pagaduria"].value),
      id_tipo_cliente: parseInt(
        this.formFinancial.controls["id_tipo_cliente"].value
      ),
      id_tipo_contrato: parseInt(
        this.formFinancial.controls["id_tipo_contrato"].value
      ),

      salario_basico: parseInt(
        this.formFinancial.controls["salario_basico"].value.replace(/,/g, "")
      ),
      otros_ingresos: parseInt(
        this.formFinancial.controls["otros_ingresos"].value.replace(/,/g, "")
      ),
      dto_volante_nomina: parseInt(
        this.formFinancial.controls["dto_volante_nomina"].value.replace(
          /,/g,
          ""
        )
      ),
      compra_volante_nomina: parseInt(
        this.formFinancial.controls["compra_volante_nomina"].value.replace(
          /,/g,
          ""
        )
      ),
      fecha_inicio_labores: this.history.buildDate(
        this.formFinancial.controls["fecha_inicio_labores"].value
      ),
    };

    this.history.saveStep2(data).subscribe((data) => {
      if (data.code && data.code == 200) {
        this.history.currentClient = {
          ...this.formBasicInfo.value,
          ...this.formFinancial.value,
          politica: data,
        };

        this.policy = data;
        console.log(JSON.stringify(this.policy))
        this.buildTasas();
        this.buildMothsCount();
        this.cuota = this.policy.valor_cuota_aprox
        this.statusSimulation = 3;
        this.socket.setSize(this.parentSocket, this.getSize());
      } else {
        this.socket.setSize(this.parentSocket, this.getSize());
        this.statusSimulation = -1;
      }
    });
  }

  async getHistoryCredit() {
    let data = {
      primer_apellido: this.formBasicInfo.controls.primer_apellido.value,
      identificacion: String(this.formBasicInfo.controls.identificacion.value),
      tipo_identificacion: String(
        this.formBasicInfo.controls.tipo_identificacion.value
      ),
      empresa: "FINEXUS",
      usuario: "",
    };
    this.history.getHistoryCredit(data).subscribe(
      async (Response) => {
        this.saveFinancialInfo();
      },
      async (err) => {
        alert(
          err.error.detail ||
          "Ha ocurrido un error al momento de realizar la consulta"
        );
      }
    );
  }

  buildTasas() {
    this.tasaMayor = Math.min.apply(
      Math,
      this.policy.tasas.map((x) => parseFloat(x.tasa))
    );
    this.tasas = this.policy.tasas.map((x) => {
      x["selected"] = this.tasaMayor == parseFloat(x.tasa);
      return x;
    });
  }

  buildMothsCount() {
    for (let i = this.policy.plazo_minimo; i <= this.policy.plazo_maximo; i++) {
      this.months.push(i);
    }

    this.plazo = this.policy.plazo_maximo;
  }

  simulate() {
    this.history
      .simulate({
        monto: parseInt(this.policy.valor_total_credito),
        tasa: parseInt(this.tasaMayor),
        plazo: parseInt(this.plazo),
        disponible: this.policy.disponible_cuota,
      })
      .subscribe((data) => {
        console.log(data)
        this.policy.valor_cuota_aprox = data.valor_cuota_aprox;
        this.policy.valor_desem_aprox = data.valor_desem_aprox;

      });
  }

  simulateV2() {
    this.history
      .simulateV2({
        tasa: parseFloat(this.tasaMayor),
        plazo: parseInt(this.plazo),
        disponible: this.policy.disponible_cuota,
        numero_solicitud: parseInt(this.currentRequestNumber || 1148),
      })
      .subscribe((data) => {
        console.log(data)
        //this.policy.valor_cuota_aprox = data.valor_cuota_aprox;
        this.policy.valor_desem_aprox = data.valor_desem_aprox;
        this.policy.valor_total_credito = data.valor_total_credito;
        //this.cuota = data.valor_cuota_aprox

        //this.simulate();
      });
  }

  get isCuotaValid() {
    return parseInt(this.cuota) <= parseInt(this.policy.disponible_cuota)
  }

  simulateV3() {
    if (!this.isCuotaValid) {
      return;
    }

    this.history
      .simulateV3({
        disponible: parseInt(this.policy.disponible_cuota),
        valor_cuota: parseInt(this.cuota),
        tasa: this.tasaMayor,
        plazo: parseInt(this.plazo),
        numero_solicitud: parseInt(this.currentRequestNumber),
      })
      .subscribe((data) => {
        console.log(data)
        this.policy.valor_desem_aprox = data.valor_desem_aprox;
        this.policy.valor_total_credito = data.valor_total_credito;
      });
  }

  saveSimulation() {
    this.history
      .saveSimulation({
        numero_solicitud: parseInt(this.currentRequestNumber),
        disponible_cuota: parseInt(this.policy.disponible_cuota),
        tasa: parseFloat(this.tasaMayor),
        plazo: parseInt(this.plazo),
        valor_solicitado: parseInt(this.policy.valor_total_credito),
        valor_cuota_aprox: parseInt(this.policy.valor_cuota_aprox),
        valor_desem_aprox: parseInt(this.policy.valor_desem_aprox),
      })
      .subscribe((data) => {
        if (data.code == 200) {
          this.goToWallets();
        } else {
          alert(data.response);
        }
      });
  }

  //WALLETS

  goToWallets() {
    this.statusSimulation = 4;
    this.socket.setSize(this.parentSocket, this.getSize());
    this.getWallet();
    this.getEntitys();
  }

  getWallet() {
    this.history
      .getWallet({
        numero_solicitud: parseInt(this.currentRequestNumber),
      })
      .subscribe((data) => {
        this.entitysMora = data.map((x) => {
          x["selected"] = x.check;
          return x;
        });
      });
  }

  getEntitys() {
    this.history.getEntityWallet().subscribe((data) => {
      this.entitys = data;
    });
  }

  addWallet() {
    let data = {
      ...this.formAddWallet.value,
      entidad: this.getName,
      saldo_actual: parseInt(
        this.formAddWallet.controls["saldo_actual"].value.replace(/,/g, "")
      ),
      selected: true,
    };
    this.entitysAdded.push(data);
    this.showAddItem = false;
    this.formAddWallet.reset();
  }

  saveWallets() {
    let walltets = [
      ...this.entitysMora.filter((x) => x.selected),
      ...this.entitysAdded.filter((x) => x.selected),
    ];
    this.history
      .saveWallet({
        numero_solicitud: parseInt(this.currentRequestNumber),
        compras: walltets,
      })
      .subscribe((data) => {
        this.saveSaes()
        this.getFiles();
        this.statusSimulation = 5;
        this.socket.setSize(this.parentSocket, this.getSize());
      });
  }

  saveSaes() {
    this.history.saveSeast(this.currentRequestNumber)
      .subscribe(data => {
        console.log('SEAS OK')
      }, err => {
        console.log(err)
      })
    //alert(this.credit.currentClient.numero_solicitud)
  }

  get getName() {
    return this.entitys.filter(
      (x) => x.id == this.formAddWallet.controls["numero"].value
    )[0].descripcion;
  }

  //FILES

  getFiles() {
    this.history
      .listFiles(parseInt(this.currentRequestNumber || 1514))
      .subscribe((data) => {
        this.files = data;
      });
  }

  openFile(id) {
    document.getElementById(id).click();
  }

  fileChange(event, id_file) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append("file", file, file.name);
      formData.append("numero_solicitud", this.currentRequestNumber);
      formData.append("id_file", id_file);

      let xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            this.getFiles();
          } else {
            alert(
              "No se pudo subir el documento, verifique su conexion a internet."
            );
          }
        }
      };

      xhr.open("POST", `${environment.apiPath}/file/upload`, true);
      xhr.setRequestHeader("Authentication", localStorage.getItem("token"));
      xhr.send(formData);
    }
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

  backPage() {
    if (this.statusSimulation > 1) {
      this.statusSimulation--;
      this.socket.setSize(this.parentSocket, this.getSize());
    } else {
      this.goToHome();
    }
  }

  async validateLastSuccessADO() {
    //await this.presentLoading()
    this.history.validateClientSuccess(this.formBasicInfo.controls.identificacion.value || 1143444600)
      .subscribe(async data => {
        window.top.open("https://adocolumbia.ado-tech.com/Finexus/verificar-persona?callback=URL_CALLBACK&key=db92efc69991&projectName=Finexus", "_blank");
      }, async err => {
        window.top.open("https://adocolumbia.ado-tech.com/Finexus/validar-persona?callback=URL_CALLBACK&key=db92efc69991&projectName=Finexus", "_blank");
      })
  }


  fillStep1() {
    this.currentRequestNumber = localStorage.getItem('numero_solicitud')
    const data = JSON.parse(localStorage.getItem('step1'))
    for (let i in data) {
      this.formBasicInfo.controls[i].setValue(data[i])
    }
  }

  goToHome() {
    window.top.location.href = "https://www.finexus.com.co";
  }

  goToFamily() {
    window.top.location.href = "https://www.finexus.com.co/familia";
  }

  masTarde() {
    this.statusSimulation = 6;
    this.socket.setSize(this.parentSocket, this.getSize());
  }

  goToContact() {
    window.top.location.href = "https://www.finexus.com.co/nosotros-te-llamamos";
    console.log('Hola')
  }
}
