import {SnackbarHelper} from "./core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {OK, OK_BN, WRONG_DATE, WRONG_DATE_BN} from "./core/constants/message";
import {ConfirmDialogConstant} from "../confirm.dialog.constant";
import {
  SubmitConfirmationDialogComponent
} from "../../app/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {Injectable} from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class AppUtils {



    /*lang property*/
    langEn: string = 'en';


    constructor(
        private snackbarHelper: SnackbarHelper,
        private matDialog: MatDialog,
        private translate: TranslateService,
        private router: Router,
    ) {
    }

    onServerSuccessResponse(res, reloadPage?): void {
        const message = this.isLocalActive() ? res.messageBn : res.message;
        const okay = this.isLocalActive() ? OK_BN : OK;
        if (res.status) {
            this.snackbarHelper.openSuccessSnackBarWithMessage(message, okay);
            if (reloadPage) {
                reloadPage();
            }
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessage(message, okay);
        }
    }

    onServerErrorResponse(error): void {
        this.snackbarHelper.openErrorSnackBar();
    }

    onServerErrorResponseWithMessage(message: string, error): void {
        this.snackbarHelper.openErrorSnackBarWithMessage(message, error);
    }

    onFailYourPermision(type): void {
        if (type === 1) {
            this.snackbarHelper.openErrorSnackBarWithMessage('do not have insert permission', 'ok');
        } else if (type === 2) {
            this.snackbarHelper.openErrorSnackBarWithMessage('do not have update permission', 'ok');
        } else if (type === 3) {
            this.snackbarHelper.openErrorSnackBarWithMessage('do not have delete permission', 'ok');
        }

    }

    formatSetupFormName(inputName: string): string {
        return inputName.toUpperCase();
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

    openReloadDialog(viewModel, callBackMethod): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.RE_PROCESS_MESSAGE};
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                callBackMethod(viewModel);
            }
            dialogRef.close(true);
        });
    }

    isLocalActive(): boolean {
        return this.translate.currentLang === this.langEn ? false : true;
    }




    // YYYYMMDD
    getDateOnlyAsStringFormateYYYYMMDD(dateReq: Date): string {
        const date = new Date(dateReq);
        const year = date.getFullYear().toString();
        let mounth = (date.getMonth() + 1).toString();
        if (mounth.length === 1) {
            mounth = '0' + mounth;
        }
        let day = date.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }

        const formatedDate = year + mounth + day;
        return formatedDate;
    }

    public calculateAge(dob: Date): string {
        if (dob) {
            const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
            const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
            return age + ' Year';
        }
        return '';
    }





    /*=============== for time format ===================*/

    getCurrentDate(): Date {
        const currentDate: Date = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return currentDate;
    }

    getTomorrowDate(): Date {
        const currentDate: Date = this.getCurrentDate();
        currentDate.setDate( currentDate.getDate() + 1 );
        return currentDate;
    }

    getCurrentTime(): string {
        const currentDate: Date = new Date();
        const hourValue = currentDate.getHours().toString().length === 1 ? '0' + currentDate.getHours().toString() : currentDate.getHours().toString();
        const minValue = currentDate.getMinutes().toString().length === 1 ? '0' + currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
        return hourValue + ':' + minValue;
    }

    getFirstDayOfCurrentMonth(): Date{
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth();
        return new Date(y, m, 1);
    }



    formatTime(fromGroup, control: string, formValue): void {
        const formTimeFormValue = formValue.value;
        // console.log(formTimeFormValue);
        const formTime = formTimeFormValue.length === 3 ? '0' + formTimeFormValue : formTimeFormValue;
        // const formTime = formTimeFormValue.length === 2 ?  formTimeFormValue + '00' : formTimeFormValue;

        if (formTime.length === 4) {
            // console.log(formTime.substring(0, 2));
            let minute = formTime.substring(2, 4);
            if ( Number(minute) > 60){
                minute = 59;
            }else {
                minute = formTime.substring(2, 4);
            }
            // console.log(minute);
            const formatTime = formTime.substring(0, 2) + ':' + minute;
            fromGroup.patchValue({
                [control]: formatTime
            });
        }

    }

    formatDate(fromGroup, control: string, formValue): void {
    }

    validFromDateToDate(fromDateValue, toDateValue): boolean{
        if (fromDateValue && toDateValue ){
            const  fromDate = new Date(fromDateValue);
            const  toDate = new Date(toDateValue);
            if (fromDate > toDate){
                const wrongDate = this.isLocalActive() ? WRONG_DATE_BN : WRONG_DATE;
                const ok = this.isLocalActive() ? OK_BN : OK;
                this.snackbarHelper.openErrorSnackBarWithMessage(wrongDate, ok);
                return false;
            }
        }
        return true;
    }



    /*emp dropdown control*/



    /*search value*/
    getBySearchValue(service: any, event: any, setDropdownList, index?, isDetails?): any {
        if (!event){ return; }
        if (event.length > 2) {
            service.getBySearchValue(event).subscribe(res => {
                isDetails ? setDropdownList(index, res.data) : setDropdownList(res.data);
            });
        }else {
            isDetails ? setDropdownList(index, []) : setDropdownList([]);
        }
    }

    setSearchValue(service: any, id: any, setDropdownList, index?, isDetails?): any{
        service.getObjectById(id).subscribe(res => {
            const tempList = [];
            tempList.push(res.data);
            isDetails ? setDropdownList(index, tempList, true) : setDropdownList(tempList, true);
        });
    }




}
