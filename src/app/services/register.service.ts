import { throwError as observableThrowError, Observable, from, BehaviorSubject, Subject, Subscription, AsyncSubject, of, throwError } from 'rxjs';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, filter, scan, catchError, mergeMap, debounceTime, distinctUntilChanged, switchMap, retry } from 'rxjs/operators';
import { BarChart, DataBarChart, DataLineChart, HSLAObject, IDataSample1, IJSONReports, LineChart, RadarChart, SliderInfo, StockData, IUser } from '../shared/data.models';

@Injectable({ providedIn: 'root' })
export class RegisterUser {
  RegisteredUser: IUser = {
    FirstName: '',
    LastName: ''
  };
  EmptyUser: IUser = {
    FirstName: '',
    LastName: ''
  };
  private userInit = new BehaviorSubject<IUser>(this.RegisteredUser);
  currentUser = this.userInit.asObservable();
  constructor(@Optional() @SkipSelf() parentModule: RegisterUser
  ) {
  }
  changeCurrentUser(user: IUser) {
    this.RegisteredUser = user;
    this.userInit.next(user);
  }
  eraseUser() {
    this.RegisteredUser = this.EmptyUser;
    this.userInit.next(this.RegisteredUser);
  }
  getCurrentUser() {
    return this.RegisteredUser;
  }
}
@Injectable({ providedIn: 'root' })
export class GeneralChartServices {
  constructor(
    private httpClient: HttpClient
  ) { }
  fileExists(url: string): Observable<boolean> {
    return this.httpClient.get(url).pipe(map(() => true), catchError(() => of(false)));
  }
  getRandomNumber(low: number, high: number) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }
  getHSLAColor(h: number, s: number, l: number, a: number) {
    return `hsl(${h}, ${s}%, ${l}%, ${a})`;
  }
  getSimpleRandomColor() {
    const characters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += characters[this.getRandomNumber(0, 15)];
    }
    return color;
  }
  getRandomColor() {
    return Math.floor(0x1000000 * Math.random()).toString(16);
  }
  getHSLARandomColor(h: number[], s: number[], l: number[], a: number[]): HSLAObject {
    const hue = this.getRandomNumber(h[0], h[1]);
    const saturation = this.getRandomNumber(s[0], s[1]);
    const lightness = this.getRandomNumber(l[0], l[1]);
    const alpha = this.getRandomNumber(a[0] * 100, a[1] * 100) / 100;
    const objectR: HSLAObject = {} as HSLAObject;
    objectR.hue = hue;
    objectR.saturation = saturation;
    objectR.lightness = lightness;
    objectR.alpha = alpha;
    objectR.HSLAValue = this.getHSLAColor(hue, saturation, lightness, alpha);
    return objectR;
  }
  getLastDay(yr: number, mm: number): number {
    const d = new Date(yr, mm + 1, 0);
    return d.getDate();
  }
  monthDiff(dateFrom: Date, dateTo: Date): number {
    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
  }
  getDateForSlider(yr: number, mm: number, mmsback: number, option: string): string[] {
    let dd = 1;
    const d = new Date(yr, (mm - 1), dd);
    d.setMonth(d.getMonth() + mmsback);
    if (option === 'end') {
      dd = this.getLastDay(d.getFullYear(), d.getMonth());
    }
    const df = new Date(d.getFullYear(), d.getMonth(), dd);
    const rdf = ('00' + (df.getMonth() + 1)).slice(-2) + '/' + ('00' + df.getDate()).slice(-2) + '/' + df.getFullYear();
    const yrstr = df.getFullYear().toString();
    const mmstr = (df.getMonth() + 1).toString();
    return [rdf, yrstr, mmstr];
  }
  checkIfMobile(): boolean {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  }
}
@Injectable({ providedIn: 'root' })
export class ObservableAsService {
  GraphLineVisible1_t1: LineChart = {};
  private GraphLineVisible1_t1_Init = new BehaviorSubject<LineChart>(this.GraphLineVisible1_t1);
  ObservableGraphLineVisible1_t1 = this.GraphLineVisible1_t1_Init.asObservable();
  GraphBarVisible1_t1: BarChart = {};
  private GraphBarVisible1_t1_Init = new BehaviorSubject<BarChart>(this.GraphBarVisible1_t1);
  ObservableGraphBarVisible1_t1 = this.GraphBarVisible1_t1_Init.asObservable();
  GraphRadarVisible1_t1: RadarChart = {};
  private GraphRadarVisible1_t1_Init = new BehaviorSubject<RadarChart>(this.GraphRadarVisible1_t1);
  ObservableGraphRadarVisible1_t1 = this.GraphRadarVisible1_t1_Init.asObservable();
  Slider_Bar_1: SliderInfo = {};
  private Slider_Bar_1_Init = new BehaviorSubject<SliderInfo>(this.Slider_Bar_1);
  ObservableSlider_Bar_1 = this.Slider_Bar_1_Init.asObservable();
  constructor(private gs: GeneralChartServices, private httpClient: HttpClient
  ) { }
  changeVisibleObservable(...args: [d: LineChart | BarChart | SliderInfo, k: string]) {
    this[args[1]] = args[0];
    this[args[1] + '_Init'].next(this[args[1]]);
    // // // // // // // // console.log(this.GraphBarVisible1_t1);
    this.GraphBarVisible1_t1_Init.next(this.GraphBarVisible1_t1);
    // // // // // // // // // console.log(this[args[1]]);
    // // // // // // // // // console.log(this[args[1] + '_Init']);
  }
  readJSONToText(
    fileURL: string, charttitle: string, charttype: string,
    chartid: number, keyfordatasets: string, keyforlables: string,
    keyforpresenteddata: string,
    observablename: string, limit: number,
    latestyear: number, latestmonth: number,
    returnedyear: number, returnedmonth: number): Observable<any> {
    // // // // // // // // // console.log(observablename);
    // // // // // // // // // // console.log(fileURL);
    return new Observable(observer => {
      this.gs.fileExists(fileURL).subscribe(x => {
        if (x) {
          this.httpClient.get(fileURL).subscribe(d => {
            const l = limit || 1;
            const yr = returnedyear || latestyear;
            const mm = returnedmonth || latestmonth;
            const dd: IDataSample1[] = (JSON.parse(JSON.stringify(d))).filter(xd => xd.FILE === l);
            dd.map(
              xdd => {
                const rv: string[] = this.gs.getDateForSlider(yr, mm, -(xdd.TIME - 1), 'end');
                xdd.TIMESTR = rv[0];
              }
            );
            const lO: LineChart = this.convertToLineChart(JSON.parse(JSON.stringify(dd)), charttitle, charttype,
              chartid, keyfordatasets, keyforlables, keyforpresenteddata);
            this.changeVisibleObservable(lO, 'GraphLineVisible1_t1');
            const bO: BarChart = this.convertToBarChart(JSON.parse(JSON.stringify(dd)), charttitle, 'Bar',
              chartid, keyfordatasets, keyforlables, keyforpresenteddata);
            this.changeVisibleObservable(bO, 'GraphBarVisible1_t1');
            // // // console.log(dd);
            observer.next(dd);
          });
        } else {
          const lO: LineChart = this.convertToLineChart([], charttitle, charttype,
            chartid, keyfordatasets, keyforlables, keyforpresenteddata);
          this.changeVisibleObservable(lO, 'GraphLineVisible1_t1');
          const bO: BarChart = this.convertToBarChart([], charttitle, 'Bar',
            chartid, keyfordatasets, keyforlables, keyforpresenteddata);
          this.changeVisibleObservable(bO, 'GraphBarVisible1_t1');
          observer.next('file missing');
        }
      });
    });
  }
  getJSONFromServer(report: IJSONReports) {
    const url = '';
    // // // // // // // // console.log(url);
    return this.httpClient.post(url, report).pipe(map((r: string) => {
      return r;
    }
    ), catchError((e: any) => observableThrowError(e)));
  }
  convertToLineChart(
    data: IDataSample1[], charttitle: string,
    charttype: string, chartid: number,
    keyfordatasets: string, keyforlables: string, keyforpresenteddata: string): LineChart {
    const dataLine: LineChart = {};
    dataLine.datasets = [];
    const datasetsInfo = [...new Set(data.map(x => x[keyfordatasets]))].filter(x => x !== undefined);
    // console.log(data);
    // console.log(datasetsInfo);
    const lables = [...new Set(data.map(x => {
      if (x[keyfordatasets] === datasetsInfo[0]) {
        return x[keyforlables];
      }
    }
    ))].filter(x => x !== undefined);
    dataLine.labels = lables;
    // console.log(lables);
    let cI = 0;
    datasetsInfo.map(y => {
      // console.log(y);
      const datasetsForDataLine: DataLineChart = {};
      const dataN = [];
      data.map(x => {
        if (x[keyfordatasets] === y) {
          dataN.push(x[keyforpresenteddata]);
          datasetsForDataLine.label = y;
        }
      });
      datasetsForDataLine.data = dataN;
      datasetsForDataLine.fill = true;
      cI += 1;
      if (cI === 1) {
        datasetsForDataLine.borderColor = 'hsl(236, 82%, 61%, 1)';
      } else {
        datasetsForDataLine.borderColor = 'hsl(102, 82%, 61%, 1)';
      }
      dataLine.datasets.push(datasetsForDataLine);
    });
    dataLine.index = chartid;
    dataLine.title = charttitle;
    // console.log(dataLine);
    return dataLine;
  }
  convertToBarChart(
    data: IDataSample1[], charttitle: string,
    charttype: string, chartid: number, keyfordatasets: string, keyforlables: string, keyforpresenteddata: string): BarChart {
    const dataBar: BarChart = {};
    dataBar.datasets = [];
    const datasetsInfo = [...new Set(data.map(x => x[keyfordatasets]))].filter(x => x !== undefined);
    const lables = [...new Set(data.map(x => {
      if (x[keyfordatasets] === datasetsInfo[0]) {
        return x[keyforlables];
      }
    }
    ))].filter(x => x !== undefined);
    dataBar.labels = lables;
    datasetsInfo.map(y => {
      const datasetsForDataBar: DataBarChart = {};
      datasetsForDataBar.borderColor = [];
      datasetsForDataBar.backgroundColor = [];
      const dataN = [];
      data.map(x => {
        if (x[keyfordatasets] === y) {
          dataN.push(x[keyforpresenteddata]);
          datasetsForDataBar.label = y;
        }
      });
      datasetsForDataBar.data = dataN;
      datasetsForDataBar.fill = true;
      dataBar.datasets.push(datasetsForDataBar);
    });
    const baseColorStep = 360 / datasetsInfo.length;
    let cI = 0;
    dataBar.datasets.map(x => {
      datasetsInfo.map(y => {
        if (y === x.label) {
          const h_range = [cI * baseColorStep, ((cI + 1) * baseColorStep) - 1];
          const s_range = [70, 80];
          const l_range = [70, 80];
          const a_range = [1, 1];
          const baseColor1 = this.gs.getHSLARandomColor(h_range, s_range, l_range, a_range);
          const baseColor2 = this.gs.getHSLAColor(baseColor1.hue, baseColor1.saturation, baseColor1.lightness, 0.3);
          x.borderColor = baseColor1.HSLAValue;
          x.backgroundColor = baseColor2;
          x.borderWidth = 1;
          cI += 1;
        }
      });
    });
    dataBar.title = charttitle;
    dataBar.index = chartid;
    return dataBar;
  }
  convertToLineChartFromStockData(
    data: StockData[], charttitle: string,
    keyfordatasets: string[]): LineChart {
    // console.log(data);
    const dataLine: LineChart = {};
    dataLine.title = charttitle;
    dataLine.index = 1;
    dataLine.datasets = [];
    const datasetsInfo = keyfordatasets;
    const lables = [...new Set(data.map(x => {
      const utcSeconds = x.t;
      var d = new Date(0);
      d.setUTCSeconds(utcSeconds);
      return d.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    ))].filter(x => x !== undefined);
    dataLine.labels = lables;
    datasetsInfo.map(y => {
      // console.log(y);
      const datasetsForDataLine: DataLineChart = {};
      const dataN = [];
      data.map(x => {
        dataN.push(x[y]);
      });
      datasetsForDataLine.data = dataN;
      datasetsForDataLine.fill = true;
      if (y === 'h') {
        datasetsForDataLine.label = 'High';
        datasetsForDataLine.borderColor = 'hsl(236, 82%, 61%, 1)';
      } else {
        datasetsForDataLine.label = 'Low';
        datasetsForDataLine.borderColor = 'hsl(102, 82%, 61%, 1)';
      }
      dataLine.datasets.push(datasetsForDataLine);
    });
    return dataLine;
  }
}
@Injectable({ providedIn: 'root' })
export class ApiStocksServices {
  keyid = 'PKROQRP68G0Q5W71FBGO';
  keysec = 'q51VAyoak0ikmw4PWY3tFWNvrMn66BAF8TMk0yZp';
  currentProjectChosenSubscription: Subscription;
  constructor(
    private http: HttpClient) {
  }
  getAllActiveStocks(): Observable<any> {
    const url = 'https://paper-api.alpaca.markets/v2/assets';
    return this.http.get(url, {
      headers: { 'APCA-API-KEY-ID': this.keyid, 'APCA-API-SECRET-KEY': this.keysec }
    }).pipe(map((r) => {
      // console.log(r);
      return r;
    }
    ), catchError((e: any) => observableThrowError(e)));
  }
  getDailyDataStocks(symbol: string): Observable<any> {
    const url = 'https://data.alpaca.markets/v1/bars/1D?symbols=' + symbol;
    return this.http.get(url, {
      headers: { 'APCA-API-KEY-ID': this.keyid, 'APCA-API-SECRET-KEY': this.keysec }
    }).pipe(map((r) => {
      // console.log(r);
      return r;
    }
    ), catchError((e: any) => observableThrowError(e)));
  }
}
