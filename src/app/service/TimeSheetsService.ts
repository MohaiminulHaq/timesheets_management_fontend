import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {BofCrudRequestService} from "../../assets/bof-crud-request.service";
import {Timesheets} from "../model/timesheets";

@Injectable({
  providedIn: 'root'
})
export class TimeSheetsService extends BofCrudRequestService<Timesheets> {

  constructor(private http: HttpClient) {
    super(http, 'http://localhost:8080/api/time-sheets')
  }

}
