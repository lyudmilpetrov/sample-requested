import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MatCard } from '@angular/material/card';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-dashboards-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('cardEl') card: MatCard;
  @Input() title: string;
  @Input() data: string;
  @Output() getExcelFromServer = new EventEmitter();
  data2: any[] = [];
  titlestr: string[];
  width = 0;
  constructor() { }
  ngOnChanges() {
    this.titlestr = this.title.split(',');
    if (typeof (this.data) !== 'undefined') {
      if (this.data.length > 0) {
        this.data2 = JSON.parse(this.data);
        // console.log(this.data2);
      }
    }
  }
  ngOnInit(): void {
    this.titlestr = this.title.split(',');
  }
  captureScreen() {
    const data = document.getElementById('contentToConvert' + this.titlestr[1]);
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      const doc: any = new jsPDF('l', 'mm', 'a4');
      const width = doc.internal.pageSize.width;
      const height = doc.internal.pageSize.height;
      const position = 0;
      doc.addImage(contentDataURL, 'PNG', 0, position, width, height);
      doc.save(this.titlestr[0] + '.pdf');
    });
  }
  getExcel() {
    const sheetname = this.titlestr[0].slice(-10).replace(/\//g, '_');
    const excelname = 'Cases_as_of_' + sheetname;
    this.exportAsExcelFile(this.data2, excelname, sheetname);
  }
  ngAfterViewInit() { }
  exportAsExcelFile(json: any[], excelFileName: string, sheetName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log(worksheet);
    // tslint:disable-next-line: one-variable-per-declaration
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
