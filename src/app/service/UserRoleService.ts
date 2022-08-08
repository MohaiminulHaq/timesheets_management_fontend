import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import {Employee} from "../model/employee";
import {BofCrudRequestService} from "../../assets/bof-crud-request.service";
import {Registration} from "../model/registration";
import {UserRole} from "../model/user-role";

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends BofCrudRequestService<UserRole> {

  constructor(private http: HttpClient) {
    super(http, 'http://localhost:8080/api/userrole')
  }




}
