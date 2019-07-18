import ILicensePlayerPivot from './ILicensePlayerPivot';

export default interface ILicense {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    pivot: ILicensePlayerPivot;
}
