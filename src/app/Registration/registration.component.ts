import {Component, OnInit} from '@angular/core';
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
import {RegistrationService} from "../service/RegistrationService";
import {Registration} from "../model/registration";
import {UserRole} from "../model/user-role";
import {UserRoleService} from "../service/UserRoleService";
import {SubmitConfirmationDialogComponent} from "../submit-confirmation-dialog/submit-confirmation-dialog.component";


@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  size: number = 5;
  page: number = 0;
  total: number;
  displayedColumns: string[] = ['userName', 'userRole', 'email', 'action'];
  frmGroup: FormGroup;
  disableDelete: boolean;
  editValue: boolean;
  model: Registration = new Registration();
  langEn: string = 'en';

  // List
  _modelList: Registration[] = new Array<Registration>();
  dataSource = new MatTableDataSource(new Array<Registration>());
  userRoleList: UserRole[] = new Array<UserRole>();

  constructor(
    private registrationService: RegistrationService,
    private userRoleService: UserRoleService,
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
    this.getMasterModelList();

  }

  getMasterModelList(): void {
    this.userRoleService.getList().subscribe(res => {
      this.userRoleList = res.data.map(m => ({
        ...m,
        name: m.roleType
      }));
    });
  }





  edit(res: Registration): any {
    this.disableDelete = true;
    this.editValue = true;
    this.model = res;
    const orderTypeValue = res.userRole ? this.userRoleList.find(model => model.id === res.userRole.id) : '';
    this.frmGroup.patchValue({
      userRole: orderTypeValue,
      userName: res.userName,
      email: res.email,
      empId: res.empId,
      dob: res.dob,
      payRate: res.payRate,
      salary: res.salary,
      payCap: res.payCap,


    });
  }

  goToEmployeeList() {
    this.router.navigate(['/registration']);
  }


  onSubmit(): any {
    this.generateModel(true);
    this.registrationService.create(this.model).subscribe(res => {
      this.goToEmployeeList();
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }

  onUpdate(): any {
    this.generateModel(false);
    this.registrationService.update(this.model).subscribe(res => {
      this.goToEmployeeList();
      this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
    }, error => {
      this.appUtils.onServerErrorResponse(error);
    });
  }

  getPageableModelList(): any {
    this.registrationService.getListWithPagination(this.page, this.size).subscribe(res => {
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

        e.userName.includes(filterValue)
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
          return this.compare(a.email, b.email, isAsc);
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

  delete(obj: Registration): any {

    this.registrationService.delete(obj).subscribe(res => {
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
      userName: ['', Validators.required],
      email: ['', Validators.required],
      userRole: ['', ''],
      empId: ['', ''],
      dob: ['', ''],
      payRate: ['', ''],
      salary: ['', ''],
      payCap: ['', ''],
    });
  }

  generateModel(isCreate: boolean): any {
    if (isCreate) {
      this.model.id = undefined;
    }
    this.model.userName = this.frmGroup.value.userName;
    this.model.email = this.frmGroup.value.email;
    this.model.userRole = this.frmGroup.value.userRole;
    this.model.payRate = this.frmGroup.value.payRate;
    this.model.salary = this.frmGroup.value.salary;
    this.model.payCap = this.frmGroup.value.payCap;
    this.model.dob = this.frmGroup.value.dob;
    this.model.empId = this.frmGroup.value.empId;

  }

  private getEmployees() {
    this.registrationService.getList().subscribe(data => {
      this._modelList = data.data;
      console.log(this._modelList);
    });
  }
}
