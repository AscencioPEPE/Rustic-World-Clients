import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendUrlService {

  private configUrl = '/backend-url.json';

  constructor(private http: HttpClient) { }

  getBackendUrl(): Observable<string> {
    return this.http.get<{ ip: string }>(this.configUrl)
      .pipe(
        map(config => config.ip),
        take(1)
      );
  }
}
