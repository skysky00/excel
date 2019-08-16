export class Position {
    sheetIndex: number;
    rowIndex: number;
    colNum: number;
    toString(): string {
        return "sheet = " + this.sheetIndex + "; row = " + this.rowIndex + "; col = " + this.colNum;
    }
}