import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { RequestCreditComponent } from './request-credit/request-credit.component';
import { SimulatorCreditComponent } from './simulator-credit/simulator-credit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactComponent } from './contact/contact.component';
import { AdoValidationComponent } from './ado-validation/ado-validation.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulatorComponent,
    RequestCreditComponent,
    SimulatorCreditComponent,
    ContactComponent,
    AdoValidationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
