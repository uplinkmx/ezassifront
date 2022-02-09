import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()

export class HttpService {

  constructor(private http: HttpClient) { }
  private urlEnv = environment.WSURL;
  public get(url: string): Promise<any> {
    const URL =  this.urlEnv + url;
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(URL, { headers})
      .toPromise()
      .then(res => res as any[])
      .then(res => {
        return res;
      });
  }

  public post(body: any, url: string): Promise<any> {
    const data = JSON.stringify(body);
    const URL =  this.urlEnv + url;
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post(URL, data, { headers })
      .toPromise()
      .then(res => res as any[])
      .then(res => {
        return res;
      });
    }
}
