import {Component, EventEmitter, OnInit} from '@angular/core';
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
import {AppUtils} from "../../assets/main/app.utils";
import {SubmitConfirmationDialogComponent} from "../submit-confirmation-dialog/submit-confirmation-dialog.component";
import {TimeSheetsService} from "../service/TimeSheetsService";
import {Timesheets} from "../model/timesheets";
import {ApprovalSubmitDialogComponent} from "../approval-submit-dialog/approval-submit-dialog.component";


@Component({
  selector: 'time-sheets',
  templateUrl: './time-sheets.component.html',
  styleUrls: ['./time-sheets.component.css']
})
export class TimeSheetsComponent implements OnInit {
  size: number = 5;
  page: number = 0;
  total: number;
  displayedColumns: string[] = ['empType', 'startWork', 'finishWork','effectiveWorkHours', 'perDayWork', 'perEmpWork', 'partTimeSalary','status', 'action'];
  frmGroup: FormGroup;
  disableDelete: boolean;
  editValue: boolean;
  model: Timesheets = new Timesheets();
  langEn: string = 'en';
  callBackMethod: EventEmitter<boolean> = new EventEmitter<boolean>();

  // List
  _modelList: Timesheets[] = new Array<Timesheets>();
  dataSource = new MatTableDataSource(new Array<Timesheets>());

  constructor(
    private timeSheetsService: TimeSheetsService,
    private router: Router,
    private translate: TranslateService,
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
    private appUtils: AppUtils,
  ) {

  }

  ngOnInit(): void {
    this.getEmployees();
    this.getPageableModelList();
    this.setFormInitValue();

  }





  edit(res: Timesheets): any {
    this.disableDelete = true;
    this.editValue = true;
    this.model = res;

    this.frmGroup.setValue({
      empType: res.empType,
      startWork: res.startWork,
      finishWork: res.finishWork,
      effectiveWorkHours: res.effectiveWorkHours,
      perDayWork: res.perDayWork,
      perEmpWork: res.perEmpWork,
      partTimeSalary: res.partTimeSalary,


    });
  }

  goToEmployeeList() {
    this.router.navigate(['/registration']);
  }


  onSubmit(): any {
    this.generateModel(true);
    this.timeSheetsService.create(this.model).subscribe(res => {
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }

  onUpdate(): any {
    this.generateModel(false);
    this.timeSheetsService.update(this.model).subscribe(res => {
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }

  getPageableModelList(): any {
    this.timeSheetsService.getListWithPagination(this.page, this.size).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data.content);
      this.total = res.data.totalElements;
    });
  }

  applyFilter(event: Event): void {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase();
    if (filterValue.length > 0) {
      this.filter(filterValue);
    } else {
      this.size = DEFAULT_SIZE;
      this.page = DEFAULT_PAGE;
      this.getPageableModelList();
    }
  }

  filter(filterValue: string): void {
    const list = [];
    this._modelList.forEach(e => {
      if (

        e.empType.includes(filterValue)
      ) {
        list.push(e);
      }
    });
    this.size = list.length;
    this.page = list.length;
    this.dataSource = new MatTableDataSource(list);
    this.total = list.length;
  }

  sortData(sort: Sort): void {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = new MatTableDataSource(data);
      return;
    }
    const sortedData = data.sort((a, b) => {

      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'email':
          return this.compare(a.empType, b.empType, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource = new MatTableDataSource(sortedData);
  }

  compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onChangePage(event: PageEvent): any {
    this.size = +event.pageSize; // get the pageSize
    this.page = +event.pageIndex; // get the current page
    this.getPageableModelList();
  }

  delete(obj: Timesheets): any {

    this.timeSheetsService.delete(obj).subscribe(res => {
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }

  openDialog(viewModel: Employee): void {
    this.openConfirmDialog(viewModel, this.delete.bind(this));

  }

  submitForApproval(res: Timesheets): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '95%';
    dialogConfig.height = '95%';
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = {
      model: res,
    };
    const dialogRef = this.matDialog.open(ApprovalSubmitDialogComponent, dialogConfig);
    dialogRef.componentInstance.callBackMethod.subscribe(value => {
    });
  }

  openConfirmDialog(viewModel, callBackDelete): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = {message: this.isLocalActive() ? ConfirmDialogConstant.MESSAGE_BN : ConfirmDialogConstant.MESSAGE};
    const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);
    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        callBackDelete(viewModel);
      }
      dialogRef.close(true);
    });
  }

  isLocalActive(): boolean {


    return this.translate.currentLang === this.langEn ? false : true;
  }

  reloadPage(): void {
    this.resetFromData();
    this.getPageableModelList();
    this.getEmployees();
  }

  resetFromData(): any {
    this.setFormInitValue();
    this.disableDelete = false;
    this.editValue = false;

  }

  setFormInitValue(): any {
    this.frmGroup = this.formBuilder.group({
      empType: ['', Validators.required],
      startWork: ['', Validators.required],
      finishWork: ['', ''],
      effectiveWorkHours: ['', ''],
      perDayWork: ['', ''],
      perEmpWork: ['', ''],
      partTimeSalary: ['', ''],
    });
  }

  generateModel(isCreate: boolean): any {
    if (isCreate) {
      this.model.id = undefined;
    }
    this.model.empType = this.frmGroup.value.empType;
    this.model.startWork = this.frmGroup.value.startWork;
    this.model.finishWork = this.frmGroup.value.finishWork;

    this.model.effectiveWorkHours = this.frmGroup.value.effectiveWorkHours;
    this.model.perDayWork = this.frmGroup.value.perDayWork;
    this.model.perEmpWork = this.frmGroup.value.perEmpWork;
    this.model.partTimeSalary = this.frmGroup.value.partTimeSalary;

  }



  private getEmployees() {
    this.timeSheetsService.getList().subscribe(data => {
      this._modelList = data.data;
      console.log(this._modelList);
    });
  }
}
