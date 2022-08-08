import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import {Employee} from "../model/employee";
import {BofCrudRequestService} from "../../assets/bof-crud-request.service";
import {Registration} from "../model/registration";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService extends BofCrudRequestService<Registration> {

  constructor(private http: HttpClient) {
    super(http, 'http://localhost:8080/api/registration')
  }

LoginUser(login: Registration):Observable< object>{
    return this.httpClient.post(`${this.baseURL } + '/' login`, login);
}


}
