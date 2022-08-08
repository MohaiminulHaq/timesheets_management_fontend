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
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  size: number = 5;
  page: number = 0;
  total: number;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'action'];
  frmGroup: FormGroup;
  disableDelete: boolean;
  editValue: boolean;
  model: Employee = new Employee();
  langEn: string = 'en';

  // List
  _modelList: Employee[] = new Array<Employee>();
  dataSource = new MatTableDataSource(new Array<Employee>());

  constructor(
    private employeeService: EmployeeService,
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

  saveEmployee() {
    this.employeeService.create(this.model).subscribe(data => {
        console.log(data);
        this.goToEmployeeList();
      },
      error => console.log(error));
  }

updateEmployee() {
  this.employeeService.update(this.model).subscribe(res => {
    this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
  }, error => {
    this.appUtils.onServerErrorResponse(error);
  });
}
  edit(res: Employee): any {
    this.disableDelete = true;
    this.editValue = true;
    this.model = res;
    this.frmGroup.setValue({
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,

    });
  }
  goToEmployeeList() {
    this.router.navigate(['/employees']);
  }


  onSubmit(): any {
    this.generateModel(true);
    this.employeeService.create(this.model).subscribe(res => {
      this.goToEmployeeList();
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }
  onUpdate(): any {
    this.generateModel(false);
    this.employeeService.update(this.model).subscribe(res => {
      this.goToEmployeeList();
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }


  private getEmployees() {
    this.employeeService.getList().subscribe(data => {
      this._modelList = data.data;
      console.log(this._modelList);
    });
  }

  getPageableModelList(): any {
    this.employeeService.getListWithPagination(this.page, this.size).subscribe(res => {
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

        e.firstName.includes(filterValue)
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
        case 'email': return this.compare(a.email, b.email, isAsc);
        default: return 0;
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
  delete(obj: Employee): any {

    this.employeeService.delete(obj).subscribe(res => {
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }
  openDialog(viewModel: Employee): void {
    this.openConfirmDialog(viewModel, this.delete.bind(this));

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
  reloadPage(): void{
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', ''],
    });
  }

  generateModel(isCreate: boolean): any{
    if (isCreate){this.model.id = undefined; }
    this.model.lastName = this.frmGroup.value.lastName;
    this.model.email = this.frmGroup.value.email;
    this.model.firstName = this.frmGroup.value.firstName;

  }
}
