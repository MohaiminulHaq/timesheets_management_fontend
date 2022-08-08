import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomePageComponent} from "./home-page/home-page.component";
import {RegistrationComponent} from "./Registration/registration.component";
import {LoginComponent} from "./Login/login.component";
import {DeshboardComponent} from "./deshboard/deshboard.component";
import {TimeSheetsComponent} from "./time-sheets/time-sheets.component";
import {TimeSheetsApproveComponent} from "./time-sheets-approve/time-sheets-approve.component";
import {ApprovalSubmit2DialogComponent} from "./approval-submit-dialog2/approval-submit2-dialog.component";

const routes: Routes = [
  { path: '', redirectTo: 'des', pathMatch: 'full' },

  { path: 'abc', component: HomePageComponent },
  { path: 'reg', component: RegistrationComponent },
  { path: 'log', component: LoginComponent },
  { path: 'des', component: DeshboardComponent },
  { path: 'tsm', component: TimeSheetsComponent },
  { path: 'tsm-approve', component: TimeSheetsApproveComponent },
  { path: 'tsm-approve2', component: ApprovalSubmit2DialogComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
