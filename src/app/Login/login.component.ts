import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {AppUtils} from "../../assets/main/app.utils";
import {RegistrationService} from "../service/RegistrationService";
import {Registration} from "../model/registration";
import {UserRole} from "../model/user-role";
import {UserRoleService} from "../service/UserRoleService";
import {LoginService} from "../service/LoginService";
import {LoginDto} from "../model/login-dto";


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  size: number = 5;
  page: number = 0;
  total: number;
  frmGroup: FormGroup;
  disableDelete: boolean;
  editValue: boolean;
  model: Registration = new Registration();
  loginModel: LoginDto = new LoginDto();
  langEn: string = 'en';

  // List
  _modelList: Registration[] = new Array<Registration>();
  dataSource = new MatTableDataSource(new Array<Registration>());
  userRoleList: UserRole[] = new Array<UserRole>();

  constructor(
    private registrationService: RegistrationService,
    private loginService: LoginService,
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


  goToEmployeeList() {
    this.router.navigate(['/reg']);
  }

  isLocalActive(): boolean {


    return this.translate.currentLang === this.langEn ? false : true;
  }

  reloadPage(): void {
    this.resetFromData();
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
    });
  }

  // login() {
  //
  //   if (this.frmGroup.value.userRole.id === 1 ) {
  //
  //
  //     this.router.navigate(['/reg']);
  //
  //   } else if (this.frmGroup.value.userRole.id === 2) {
  //
  //     this.router.navigate(['/abc']);
  //
  //   } else {
  //     this.router.navigate(['/sddsds']);
  //   }
  //
  //
  // }


  login (){

    this.loginModel.userName = this.frmGroup.value.userName;
    this.loginModel.email = this.frmGroup.value.email;
    console.log(this.loginModel);
    this.loginService.signIn(this.loginModel).subscribe(data=>{
      console.log(data);
      if(this.frmGroup.value.userRole.id === 1 ){
        this.router.navigate(['/tsm-approve']);
      }
      if(this.frmGroup.value.userRole.id === 2){
        this.router.navigate(['/tsm']);
      }
      // else{  alert("dffdfddf")
      //   this.router.navigate(['/log']);
      //
      // }
    })


  }

  private getEmployees() {
    this.registrationService.getList().subscribe(data => {
      this._modelList = data.data;
    });
  }

}
