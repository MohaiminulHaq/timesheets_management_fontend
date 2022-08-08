import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CommonResponseList } from 'app/main/core/models/common-response';
import {BofCrudRequestService} from '../../core/services/bof-crud-request.service';
import {CommonFileUpload} from '../model/common-file-upload';

/**
 * @Project   bmtf-demo-ui
 * @Author    Md. Mizanur Rahman - 598
 * @Mail      mizanur.rahman@ibcs-primax.com
 * @Since     March 28, 2022
 * @version   1.0.0
 */

@Injectable({
  providedIn: 'root'
})
export class CommonFileUploadService extends BofCrudRequestService<CommonFileUpload>{

    constructor(private http: HttpClient) {
      super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleCommon + 'common-file-upload');
    }

    downloadFile(filename: string): any {
      return this.http.get(this._BASE_URL + '/download/' + filename, {responseType: 'blob'});
    }

    printFile(filename: string): any {
        return this.http.get(this._BASE_URL + '/print/' + filename, {responseType: 'blob'});
    }

    getByTableAndTransectionId(table: string, id: number): Observable<CommonResponseList<CommonFileUpload>> {
        return this.http.get<CommonResponseList<CommonFileUpload>>( this._BASE_URL + '/table/id/' + table + '/' + id);
    }

}
