export class MetaData {
    public id: string;
    public type: MetaDataType;
    public payload: any;

    constructor(id: string, type: MetaDataType, payload: any) {
        this.id = id;
        this.type = type;
        this.payload = payload;
    }
}

export enum MetaDataType {
    HI = 0,
    SDP = 1,
    ICE = 2,
    ROOM = 3
}