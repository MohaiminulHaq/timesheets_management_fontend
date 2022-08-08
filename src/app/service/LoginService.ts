import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs';
import {Employee} from "../model/employee";
import {BofCrudRequestService} from "../../assets/bof-crud-request.service";
import {Registration} from "../model/registration";
import {LoginDto} from "../model/login-dto";

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BofCrudRequestService<Registration> {

  constructor(private http: HttpClient) {
    super(http, 'http://localhost:8080/api/')
  }

  LoginUser(login: Registration): Observable<object> {
    return this.httpClient.post(`${this.baseURL}`, login);
  }

  signIn(login: LoginDto): Observable<Registration> {
    return this.httpClient.post<Registration>(`${this.baseURL + 'login'}`, login);
  }


}
