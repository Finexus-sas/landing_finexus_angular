import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SimulatorCreditComponent } from "./simulator-credit/simulator-credit.component";
import { RequestCreditComponent } from "./request-credit/request-credit.component";
import { ContactComponent } from './contact/contact.component';
import { AdoValidationComponent } from './ado-validation/ado-validation.component';
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  {
    path: "simulator/:socket",
    component: SimulatorCreditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "request/:socket",
    component: RequestCreditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "request/:socket/creditApplication/:step",
    component: RequestCreditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "request/:currentLead/:socket",
    component: RequestCreditComponent,
    canActivate: [AuthGuard],
  },
  
  {
    path: "contact",
    component: ContactComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "validacion-de-identidad/:socket",
    component: AdoValidationComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
