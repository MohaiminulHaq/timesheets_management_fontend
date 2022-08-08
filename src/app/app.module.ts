import {Injectable, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { HomePageComponent } from './home-page/home-page.component';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app.routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatListModule} from "@angular/material/list";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatStepperModule} from "@angular/material/stepper";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDialogModule} from "@angular/material/dialog";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTabsModule} from "@angular/material/tabs";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatRadioModule} from "@angular/material/radio";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDividerModule} from "@angular/material/divider";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateModule} from '@ngx-translate/core';
import {SubmitConfirmationDialogComponent} from "./submit-confirmation-dialog/submit-confirmation-dialog.component";
import {RegistrationComponent} from "./Registration/registration.component";
import {SharedModule} from "../assets/main/shared/shared.module";
import {LoginComponent} from "./Login/login.component";
import {DeshboardComponent} from "./deshboard/deshboard.component";
import {TimeSheetsComponent} from "./time-sheets/time-sheets.component";
import {ApprovalSubmitDialogComponent} from "./approval-submit-dialog/approval-submit-dialog.component";
import {TimeSheetsApproveComponent} from "./time-sheets-approve/time-sheets-approve.component";
import {ApprovalSubmit2DialogComponent} from "./approval-submit-dialog2/approval-submit2-dialog.component";


@Injectable({
  providedIn: 'root'
})
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegistrationComponent,
    LoginComponent,
    DeshboardComponent,
    TimeSheetsComponent,
    ApprovalSubmitDialogComponent,
    TimeSheetsApproveComponent,
    ApprovalSubmit2DialogComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatChipsModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatSortModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatGridListModule,
    MatMenuModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule { }
