import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { HttpHeaders } from "@angular/common/http";
import { min } from "rxjs/operators";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class HistoryCreditService {
  constructor(private http: HttpService) {}

  all() {
    return this.http.post("/generic/request", {
      resource: "/generic/request/lista-solicitud",
    });
  }

  get(identification) {
    return this.http.get("/hdc/resumen/" + identification);
  }

  getHistoryCredit(data: IClient) {
    return this.http.post("/hdc/historia-credito", data);
  }

  getTypeId() {
    return this.http.post("/generic/request", {
      resource: "/generic/request/tipo-ident",
    });
  }

  getGender() {
    return this.http.post("/generic/request", {
      resource: "/generic/request/genero",
    });
  }

  getPaying() {
    return this.http.post("/generic/request", {
      resource: "/generic/request/pagadurias",
    });
  }

  getTypeClient(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/tipo-cliente",
      data,
    });
  }

  getTypeContracts(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/tipo-contrato",
      data,
    });
  }

  getTypeCredit() {
    return this.http.post("/generic/request", {
      resource: "/generic/request/tipo-credito",
    });
  }

  getWallet(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/compra-cartera",
      data,
    });
  }

  getEmials() {
    return this.http.post("/generic/request", {
      resource: "/generic/request/lista-email",
    });
  }

  saveLead(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/save-lead",
      data,
    });
  }

  saveSimulationLead(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/simulacion-lead",
      data,
    });
  }

  autoCompleteRequest(idLead) {
    return this.http.get("/generic/get-simulacion/" + idLead);
  }

  saveStep1(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/save-solicitud",
      data,
    });
  }

  saveStep2(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/save-solicitud-financiera",
      data,
    });
  }

  simulate(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/simular-cuota",
      data,
    });
  }

  simulateV2(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/simular-cuota-v2",
      data,
    });
  }

  simulateV3(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/simular-cuota-v3",
      data,
    });
  }

  saveSimulation(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/save-solicitud-valores",
      data,
    });
  }

  saveWallet(data) {
    return this.http.post("/generic/request", {
      resource: "/generic/request/add-compra-cartera",
      data,
    });
  }

  saveSeast(numero_solicitud) {
    return this.http.get("/generic/add-seas/" + numero_solicitud);
  }

  getEntityWallet() {
    return this.http.post("/generic/request", {
      resource: "/generic/request/entidades-compra-cartera",
    });
  }

  saveContact(data){
    return this.http.post("/generic/request", {
      resource: "/generic/request/validar-solicitud",
      data
    });
  }

  validateBussiness(data){
    return this.http.post("/generic/request", {
      resource: "/generic/request/validar-solicitud",
      data
    });
  }

  // validateClientADO(id) {
  //   const options = {
  //     headers: {
  //       apiKey: "db92efc69991",
  //     },
  //   };
  //   return this.http.get(
  //     "https://adocolumbia.ado-tech.com/Finexus/api/finexus/FindByNumberId?identification=" +
  //       id +
  //       "&docType=1&returnImages=false"
  //   );
  // }


  

  saveADOReponse(data) {
    return this.http.post('/generic/request', { "resource": "/generic/request/save-enrolamiento", data });
  }

  validateClientADO(id) {
    const options = {
      headers: {
        apiKey: "db92efc69991"
      }
    }
    return this.http.get('https://adocolumbia.ado-tech.com/Finexus/api/Finexus/FindByNumberId?identification=' + id + '&docType=1&returnImages=false');
  }

  validateClientADOByIdTrasanction(id) {
    const options = {
      headers: {
        apiKey: "db92efc69991"
      }
    }
    return this.http.get('https://adocolumbia.ado-tech.com/Finexus/api/Finexus/Validation?id=' + id + '&docType=1&returnImages=false');
  }

  validateClientSuccess(id) {
    const options = {
      headers: {
        apiKey: "db92efc69991"
      }
    }
    return this.http.get('https://adocolumbia.ado-tech.com/Finexus/api/Finexus/FindByNumberIdSuccess?identification=' + id + '&docType=1&returnImages=false');
  }


  listFiles(numero_solicitud) {
    return this.http.get("/file/list-file/" + numero_solicitud);
  }

  deleteFile(numero_solicitud, id_archivo) {
    return this.http.get("/file/delete/" + numero_solicitud + "/" + id_archivo);
  }

  viewFile(numero_solicitud, id_archivo) {
    window.open(
      environment.apiPath +
        "/file/download/" +
        numero_solicitud +
        "/" +
        id_archivo,
      "_blank"
    );
  }


  buildDate(object) {
    if (!(object.year && object.month && object.day)) {
      return "";
    }

    let month = String(object.month).length == 1 ? "0" + String(object.month) : String(object.month)
    let day = String(object.day).length == 1 ? "0" + String(object.day) : object.day

    console.log(object.year + "-" + month + "-" + day)
    return object.year + "-" + month + "-" + day
  }

  get currentClient() {
    return JSON.parse(localStorage.getItem("client"));
  }

  set currentClient(client) {
    localStorage.setItem("client", JSON.stringify(client));
  }

  get wallets() {
    return JSON.parse(localStorage.getItem("wallets"));
  }

  set wallets(data) {
    localStorage.setItem("wallets", JSON.stringify(data));
  }
}

export interface IClient {
  tipo_identificacion: string;
  identificacion: string;
  primer_apellido: string;
  empresa: string;
  usuario: string;
}
