import { CommonModelField } from 'app/main/core/models/common-model-field';

/**
 * @Project   bmtf-demo-ui
 * @Author    Md. Mizanur Rahman - 598
 * @Mail      mizanur.rahman@ibcs-primax.com
 * @Since     March 28, 2022
 * @version   1.0.0
 */

export class CommonFileUpload extends CommonModelField{

    fileName: string;
    fileLocation: string;
    fileTitle: string;
    tableName: string;
    tableTransectionId: number;
    moduleId: number;
    serialNo: string;
    isImage: boolean;
    isSignature: boolean;
    extension: string;
}
