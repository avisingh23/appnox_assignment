export interface IPaginationParams {
    offset?: number;
    limit?: number;
}

export interface ISortByParams {
    sortBy?: string;
}

export enum UploadedFileType {
    CsvFile = 'text/csv',
    XlsxFile = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export enum MobileVerifyStatus {
    Approved = 'approved',
    Pending = 'pending',
}

export enum PaymentStatus {
    Paid = 'paid',
    Pending = 'pending',
}
