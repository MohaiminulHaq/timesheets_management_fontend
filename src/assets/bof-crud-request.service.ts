import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommonResponseList, CommonResponseObject, CommonResponsePageable} from "./common-response";
import {Employee} from "../app/model/employee";
import {URL_GET_PAGEABLE} from "./api";
import {Registration} from "../app/model/registration";



export abstract class BofCrudRequestService<I> {

  protected constructor(protected httpClient: HttpClient,
                        protected baseURL: string) {
  }
  getEmployeesList(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${this.baseURL}`);
  }

  createEmployee(employee: Employee): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}`, employee);
  }

  getEmployeeById(id: number): Observable<Employee>{
    return this.httpClient.get<Employee>(`${this.baseURL}/${id}`);
  }

  updateEmployee(id: number, employee: Employee): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<Object>{
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }


    // common
    create(i: I): Observable<CommonResponseObject<I>> {
        return this.httpClient.post<CommonResponseObject<I>>( this.baseURL, i);
    }

    update(i: I): Observable<CommonResponseObject<I>> {
        return this.httpClient.put<CommonResponseObject<I>>( this.baseURL, i);
    }

    delete(i: I): Observable<CommonResponseObject<I>> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: i
        };
        return this.httpClient.delete<CommonResponseObject<I>>( this.baseURL, httpOptions);
    }

    getList(): Observable<CommonResponseList<I>> {
        return this.httpClient.get<CommonResponseList<I>>( this.baseURL);
    }

    // getActiveList(): Observable<CommonResponseList<I>> {
    //     return this.httpClient.get<CommonResponseList<I>>( this._BASE_URL + '/' + URL_ACTIVE);
    // }
    //
    getListWithPagination(page: number, size: number): Observable<CommonResponsePageable<I>> {
        return this.httpClient.get<CommonResponsePageable<I>>( this.baseURL + '/' + URL_GET_PAGEABLE + '/' + page + '/' + size);
    }
    //
    // // other
    // getListByMasterId(id: number): Observable<CommonResponseList<I>> {
    //     return this.httpClient.get<CommonResponseList<I>>( this._BASE_URL + '/' + URL_GET_BY_MASTER_ID + '/' + id.toString());
    // }
    //
    // getObjectById(id: number): Observable<CommonResponseObject<I>> {
    //     return this.httpClient.get<CommonResponseObject<I>>( this._BASE_URL + '/' + URL_GET_BY_ID + '/' + id.toString());
    // }
    //
    // getBySearchValue(searchValue: string): Observable<CommonResponseList<I>> {
    //     return this.httpClient.get<CommonResponseList<I>>(this._BASE_URL + '/' + URL_GET_SEARCH + '/' + searchValue);
    // }



}
