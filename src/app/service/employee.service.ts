import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../config/global';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get(GlobalVariable.COUNTRIES_URL, {
      headers: this.getHeadersNA(),
    })
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(buildGetUrl(GlobalVariable.READ_ALL_EMPLOYEES), {
      headers: this.getHeadersNA(),
    })
  }

  getEmployee(id: string): Observable<any> {
    return this.http.get(buildGetUrlById(GlobalVariable.READ_ONE_EMPLOYEE, id), {
      headers: this.getHeadersNA(),
    })
  }

  createEmployee(submission: any): Observable<any> {
    return this.http.post(
      buildPostUrl(GlobalVariable.CREATE_EMPLOYEE), submission, {
      headers: this.getHeadersNA()
    })
  }

  updateEmployee(submission: any): Observable<any> {
    return this.http.post(
      buildPostUrl(GlobalVariable.UPDATE_EMPLOYEE), submission, {
      headers: this.getHeadersNA()
    })
  }

  deleteEmployee(submission: any): Observable<any> {
    return this.http.post(
      buildPostUrl(GlobalVariable.DELETE_EMPLOYEE), submission, {
      headers: this.getHeadersNA()
    })
  }

  private getHeadersNA() {
    // I included these headers because otherwise FireFox
    // will request text/html instead of application/json
    const headers = new HttpHeaders()
    headers.set("Accept", "application/json")
    return headers
  }
}

function buildGetUrl(type: string): string {
  let finalUrl = GlobalVariable.API_REST_URL
  finalUrl += type
  return finalUrl
}

function buildGetUrlById(type: string, id: string): string {
  let finalUrl = GlobalVariable.API_REST_URL
  finalUrl += type
  finalUrl += "?id=" + id
  return finalUrl
}

function buildPostUrl(type: string): string {
  let finalUrl = GlobalVariable.API_REST_URL
  finalUrl += type
  return finalUrl
}