import { Component, ViewChild } from '@angular/core';
import  { WorkSheet , WorkBook, read, utils} from 'xlsx';
import * as FileSaver from 'file-saver';
import { AgGridAngular } from 'ag-grid-angular';
import { Position } from './position';
import { Room } from './room';
import { Accom } from './accom';
import { RowNode, CellPosition } from 'ag-grid-community';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  columnDefs = [];
  rowData = [];
  sheetsData: Map<number, any[]> = new Map();
  currentObj: any = null;
  sheetNames: string[] = []
  
  worksheet: WorkSheet;
  workbook: WorkBook;

  indexActiveSheet: number;
  selectedPropertie: string;
  accom: Accom = null;
  rooms: Room[] = [];

  title = 'read-excel-in-angular8';
  storeData: any;
  csvData: any;
  jsonData: any;
  textData: any;
  htmlData: any;
  fileUploaded: File;
  tab: any;

  uploadedFile(event) {
    this.fileUploaded = event.target.files[0];
    this.readExcel();
  }
  readExcel() {
    let readFile = new FileReader();
    readFile.readAsArrayBuffer(this.fileUploaded);
  
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      var bstr = arr.join("");
      this.workbook = read(bstr, { type: "binary" });
      this.sheetNames = this.workbook.SheetNames;
      this.readAsJson();
    }
  }
  readAsCSV() {
    this.csvData = utils.sheet_to_csv(this.worksheet);
    const data: Blob = new Blob([this.csvData], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(data, "CSVFile" + new Date().getTime() + '.csv');
  }
  readAsJson() {

    this.loadSheet(0);  
      //console.log(this.columnDefs);
    /*const data: Blob = new Blob([this.jsonData], { type: "application/json" });  
    FileSaver.saveAs(data, "JsonFile" + new Date().getTime() + '.json');  */
  }

  getSheetData(sheetIndex: number, whorkSheet: WorkSheet): any[] {
    let data: any[] = [];
    let columnDefs: any[] = [];
  
    let columnsNameTmp = [];
    let rowData: any[] = utils.sheet_to_json(whorkSheet, { raw: false, blankrows: false, header: 1 });
    
    rowData.map(object => {
       Object.keys(object).forEach(key => {columnsNameTmp.push(key)}); 
    });
    let columnNameSorted: Set<number> = new Set(columnsNameTmp.sort((a, b) => a - b));
    columnNameSorted.forEach(value => columnDefs.push({ headerName: value, field: value }));
    
    data.push(columnDefs);
    data.push(rowData);      
    return data;
  }


  readAsHTML() {
    this.tab = utils.sheet_to_html(this.worksheet);
    const data: Blob = new Blob([this.tab], { type: "text/html;charset=utf-8;" });
    FileSaver.saveAs(data, "HtmlFile" + new Date().getTime() + '.html');
  }
  readAsText() {
    this.textData = utils.sheet_to_txt(this.worksheet);
    const data: Blob = new Blob([this.textData], { type: 'text/plain;charset=utf-8;' });
    FileSaver.saveAs(data, "TextFile" + new Date().getTime() + '.txt');
  }

  savePosition() {

    if (this.currentObj != null) {
      let focusedCell: CellPosition = this.agGrid.api.getFocusedCell();
      if (focusedCell != null) {
        let position = new Position();
        position.sheetIndex = this.indexActiveSheet;
        position.colNum = +focusedCell.column.getDefinition().headerName;
        position.rowIndex = focusedCell.rowIndex;
        this.currentObj[this.selectedPropertie] = position;
      }
      
    }
 }

  selectRoom(i: number) {
    if (i == -1) {
      let room: Room = new Room();
      this.rooms.push(room);
      i = this.rooms.length - 1;
    }
    this.currentObj = this.rooms[i];
  }

  selectAccom() {
    if (this.accom == null) {
      this.accom = new Accom();
    }
    this.currentObj = this.accom;
  }

  getProperties(): string[] {
    return Object.getOwnPropertyNames(this.currentObj);
  }

  getValues() {

    let all: any[] = [];
    
    if (this.accom != null) {
      if (this.accom.accomCode == null) {
        throw "Accom code not found"
      } else {
        all.push(this.accom);
      }
    }

    this.rooms.forEach(room => all.push(room));    
    try {
      all.forEach(obj => {
        let mapObject: Map<string, Position> = new Map();
        let accomCodePosition: Position = null;
        let minRowIndex = Number.MAX_SAFE_INTEGER;
        let maxRowIndex = Number.MIN_SAFE_INTEGER;
        accomCodePosition = obj["accomCode"];
        Object.getOwnPropertyNames(obj).forEach(prop => {
          if (prop != "accomCode" && obj[prop] != null) {
            mapObject.set(prop, obj[prop]);
            maxRowIndex = Math.max(maxRowIndex, obj[prop].rowIndex);
            minRowIndex = Math.min(minRowIndex, obj[prop].rowIndex);
          }
        });
        if (accomCodePosition != null) {
          let accomCode = null;
          let i: number = 0;
          do {
            accomCode = this.getValueByPosition(accomCodePosition, i);
            if (accomCode != null && accomCode != "") {
              let mapValues: Map<string, any> = new Map();
              mapObject.forEach((value, key) => {
                var cellValue = this.getValueByPosition(value, i);
                mapValues.set(key, cellValue);
              });
              console.log(mapValues);
            }
            i = i + (maxRowIndex - minRowIndex) + 1;
          } while (accomCode != null && accomCode != "");
        } else {
          throw "Accom code not found"
        }
      });

    } catch (e) {
      console.log(e);
    } 
  }

  getValueByPosition(position: Position, offset: number): string {
    let data: any[] = this.sheetsData.get(position.sheetIndex);
    if (data[1].length > (position.rowIndex + offset)) {
      return data[1][position.rowIndex + offset][position.colNum];
    } else {
      return null;
    }
  }

  loadSheet(sheenIndex: number) {
    this.worksheet = this.workbook.Sheets[this.sheetNames[sheenIndex]];    
    let data : any[] = this.sheetsData.get(sheenIndex)
    
    if (typeof data === "undefined" || data == null) {
      data = this.getSheetData(sheenIndex, this.worksheet);
      this.sheetsData.set(sheenIndex, data);
    }
    
    this.indexActiveSheet = sheenIndex;   
    this.rowData = data[1];
    this.columnDefs = data[0];
  }
}  