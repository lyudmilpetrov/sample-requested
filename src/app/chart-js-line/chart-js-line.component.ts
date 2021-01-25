import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartInfo, IDataSample1, IJSONReports, JSONFile, LineChart, SliderInfo } from '../shared/data.models';
import { GeneralChartServices, ObservableAsService } from '../services/register.service';

@Component({
  templateUrl: './chart-js-line.html',
  styleUrls: ['./chart-js-line.css']
})
export class ChartJSLineComponent implements OnInit, OnDestroy, AfterViewInit {
  breakpoint: number;
  showdata = false;
  forSlider_Min: number;
  forSlider_Max: number;
  forSlider_LatestYear: number;
  forSlider_LatestMonth: number;
  forSlider_1: SliderInfo = {
    id: 1,
    observable: 'Slider_Bar_1'
  };
  dataLine1: LineChart = {};
  d1CI: ChartInfo = {};
  titleForCard0 = '';
  error: any;
  data: string;
  headers: string[];
  mobileHide = false;
  _jsonFile: JSONFile;
  _jsonBaseURL = '../../assets/json/';
  result = 0;
  Line_Sample1: LineChart[] = [];
  Line_Sample1_Subscription: Subscription;
  Slider_Data_1: SliderInfo = {};
  Slider_Data_1_Subscription: Subscription;
  currentUserSubscription: Subscription;
  Report1: IJSONReports = {
    ReportName: '',
    DateOfReference: '',
    Transport: '',
    PBK: '',
    Connection: '',
    UserName: '',
    UserMachine: ''
  };
  constructor(
    private gcs: GeneralChartServices,
    private OAS: ObservableAsService) {
    if (this.gcs.checkIfMobile()) {
      this.mobileHide = true;
    }
    this.initilizeAll();
    this.Slider_Data_1_Subscription = this.OAS.ObservableSlider_Bar_1.subscribe(x => {
      if (Object.keys(x).length !== 0) {
        this.showdata = false;
        this.Slider_Data_1 = x;
        this.updateData(this.Slider_Data_1);
      }
    });
  }
  ngOnInit() { }
  ngAfterViewInit() { }
  ngOnDestroy() {
    if (this.Line_Sample1_Subscription) {
      this.Line_Sample1_Subscription.unsubscribe();
    }
    if (this.Slider_Data_1_Subscription) {
      this.Slider_Data_1_Subscription.unsubscribe();
    }
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }
  initilizeAll() {
    const color = 'hsla(0, 0%, 29%, 0.84';
    this.d1CI.id = 1;
    this.d1CI.type = 'Line';
    this.d1CI.style = color;
    this.d1CI.observable = 'GraphLineVisible1_t1';
    this.forSlider_Min = 1;
    this.forSlider_Max = 12;
    const d = new Date();
    this.forSlider_LatestYear = d.getFullYear();
    this.forSlider_LatestMonth = d.getMonth() + 1;
    this.forSlider_1.latestmonth = this.forSlider_LatestMonth;
    this.forSlider_1.latestyear = this.forSlider_LatestYear;
    this.forSlider_1.min = this.forSlider_Min;
    this.forSlider_1.max = this.forSlider_Max;
    const rv: string[] = this.gcs.getDateForSlider(this.forSlider_1.latestyear, this.forSlider_1.latestmonth, 0, 'end');
    this.forSlider_1.returneddate = rv[0];
    this.OAS.changeVisibleObservable(this.forSlider_1, this.forSlider_1.observable);
    this.titleForCard0 = 'Cases in Line format as of ' + this.forSlider_1.returneddate + ',0';
  }
  updateData(x: SliderInfo) {
    if (typeof this.Report1.DateOfReference === 'undefined') {
      const rv: string[] = this.gcs.getDateForSlider(this.Slider_Data_1.latestyear, this.Slider_Data_1.latestmonth, 0, 'end');
      this.Report1.DateOfReference = rv[0];
    } else {
      this.Report1.DateOfReference = x.returneddate;
    }
    this.Report1.ReportName = 'Cases';
    this.Report1.Transport = '';
    const fileURL1 = this._jsonBaseURL + 'cases.json';
    this.d1CI.title = this.Report1.ReportName + ' as of ' + this.Report1.DateOfReference;
    this.titleForCard0 = 'Cases in Line format as of ' + this.Report1.DateOfReference + ',0';
    setTimeout(() => {
      this.OAS.readJSONToText(fileURL1, this.d1CI.title, 'Line', 1, 'CASES',
        'TIMESTR', 'COUNT', 'GraphLineVisible1_t1', x.value,
        x.latestyear, x.latestmonth, x.returnedyear, x.returnedmonth).subscribe(
          res => {
            // // // // // console.log(JSON.stringify(res));
            this.data = JSON.stringify(res);
            // // // // console.log(this.data);
            this.showdata = true;
          }
        );
    }, 500);
  }
}
