import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CustomEncoder } from '../shared/custom-encoder';
import { Observable } from 'rxjs';
import { CompanyModel } from './companyModel';

@Injectable({providedIn: 'root'})
export class CompanyService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  public getList(page: number): Observable<CompanyModel[]> {
    const url = this.url + 'companies/getListOfCompanies';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('page', String(page));
    return this.http.post<CompanyModel[]>(url, params);
  }

  save(company: { name: string; description: string }): Observable<CompanyModel> {
    const url = this.url + 'companies/addCompany';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('name', company.name);
    params = params.append('description', company.description);
    return this.http.post<CompanyModel>(url, params);
  }

  getById(id: number): Observable<CompanyModel> {
    const url = this.url + 'companies/getById';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<CompanyModel>(url, params);
  }

  addComment(text: any, id: number, parentId?: number) {
    const url = this.url + 'companies/addComment';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    params = params.append('text', text);
    params = parentId ? params.append('parentId', String(parentId)) : params;
    return this.http.post(url, params);
  }

  getComments(id: number): Observable<any> {
    const url = this.url + 'companies/getComments';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<any>(url, params);
  }

  update(id: number, text: string) {
    const url = this.url + 'companies/updateComment';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    params = params.append('text', text);
    return this.http.post<any>(url, params);
  }

  delete(id: number) {
    const url = this.url + 'companies/deleteComment';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<any>(url, params);
  }
}
