import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../service/EmployeeService";
import {Router} from "@angular/router";
import {Employee} from "../model/employee";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../assets/constant";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../assets/confirm.dialog.constant";
import {TranslateService} from "@ngx-translate/core";
import {SubmitConfirmationDialogComponent} from "../submit-confirmation-dialog/submit-confirmation-dialog.component";
import {AppUtils} from "../../assets/main/app.utils";


@Component({
  selector: 'app-home-page',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.css']
})
export class DeshboardComponent implements OnInit {

  langEn: string = 'en';

  // List

  constructor(

    private router: Router,
    private translate: TranslateService,
    private appUtils: AppUtils,



  ) {

  }

  ngOnInit(): void {



  }
  login (){

        this.router.navigate(['/reg']);


  }
  login2(){

        this.router.navigate(['/log']);


  }

}
