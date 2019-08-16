import { Position } from "./position";
import { Id } from "./Id";

export class Room implements Id {
    accomCode: string = null;
    code: Position  = null;
    accomId: Position = null;
    labelFre: Position = null;
    labelEng: Position = null;
    labelGer: Position = null;
    labelSpa: Position = null;
    labelIta: Position = null;
    labelRus: Position = null;
    labelPor: Position = null;
    labelNld: Position = null;
    genericRoomTypeCode: Position = null;
    minPaxNumber: Position = null;
    minAdultNumber: Position = null;
    maxAdultNumber: Position = null;
    minTeenagerNumber: Position = null;
    maxNeenagerNumber: Position = null;
    minChildNumber: Position = null;
    maxChildNumber: Position = null;
    minCotNumber: Position = null;
    maxCotNumber: Position = null;
    isPaxTypeNotConsidered: Position = null;
    considerInfantAsOccupant: Position = null;
    size: Position = null;
    sizeUnit: Position = null;
    descriptions: Position = null;
}
