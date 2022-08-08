import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {MatTableDataSource} from '@angular/material/table';
import {ValidationMessage} from "../../assets/main/core/constants/validation.message";
import {BehaviorSubject} from "rxjs";
import {Timesheets} from "../model/timesheets";
import {Router} from "@angular/router";
import {FuseTranslationLoaderService} from "../../assets/translation-loader.service";
import {TimeSheetsService} from "../service/TimeSheetsService";
import {AppUtils} from "../../assets/main/app.utils";
import {TranslateService} from "@ngx-translate/core";



@Component({
    selector: 'spr-approval-submit-dialog',
    templateUrl: './approval-submit2-dialog.component.html',
    styleUrls: ['./approval-submit2dialog.component.scss']
})
export class ApprovalSubmit2DialogComponent implements OnInit {

    callBackMethod: EventEmitter<boolean> = new EventEmitter<boolean>();

    // porperty
    validationMsg: ValidationMessage = new ValidationMessage();

    // object
    model:Timesheets = new Timesheets();
  frmGroup: FormGroup;
  disableDelete: boolean;
  editValue: boolean;
    transactionId: number;
    dataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    dataSource = new MatTableDataSource();
    rows: FormArray = this.formBuilder.array([]);
    frmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.rows
    });
    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------
  langEn: string = 'en';

    constructor(
        public dialogRef: MatDialogRef<ApprovalSubmit2DialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private router: Router,
        private formBuilder: FormBuilder,
        private modelService: TimeSheetsService,
        private translate: TranslateService,

        private appUtils: AppUtils,

        private fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.model = data.model;

        this.transactionId = data.transactionId;

    }

    ngOnInit(): void {
      this.setFormInitValue();

    }
  reloadPage(): void {
    this.resetFromData();

  }

  resetFromData(): any {
    this.setFormInitValue();
    this.disableDelete = false;
    this.editValue = false;

  }
    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

  onUpdate(): any {
    this.generateModel(false);
    this.modelService.update(this.model).subscribe(res => {
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }
  setFormInitValue(): any {
    this.frmGroup = this.formBuilder.group({

      approve: ['', ''],
    });
  }

  generateModel(isCreate: boolean): any {
    if (isCreate) {
      this.model.id = undefined;
    }

    this.model.approve = this.frmGroup.value.approve;

  }

  edit(res: Timesheets): any {
    this.disableDelete = true;
    this.editValue = true;
    this.model = res;

    this.frmGroup.setValue({
      approve: res.approve,


    });
  }

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    onNoClick(): void {
        this.dialogRef.close();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
  isLocalActive(): boolean {


    return this.translate.currentLang === this.langEn ? false : true;
  }
}
