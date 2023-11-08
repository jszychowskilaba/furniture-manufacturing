import { Labor } from "../../types/Labor";

export class LaborDto implements Labor{
    status: "active" | "inactive";
    internalCode: string;
    description: string;
    pricePerUnit: number;
    timePerUnit: number;
    unit: string;
    internalNotes: string;

    constructor(labor: Labor){
        this.status = labor.status;
        this.internalCode = labor.internalCode;
        this.description = labor.description;
        this.pricePerUnit = labor.pricePerUnit;
        this.timePerUnit = labor.timePerUnit;
        this.unit = labor.unit;
        this.internalNotes = labor.internalNotes;
    }

}