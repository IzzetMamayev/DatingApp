import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

baseUrl1 = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]>  {        
    return this.http.get<User[]>(this.baseUrl1 + 'users');
  }

  getUser(id): Observable<User> {
    // vozvrashat odnoqo usera
    return this.http.get<User>(this.baseUrl1 + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl1 + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl1 + 'users/' + userId + '/photos/' + id + '/setMain', {}); // eto post request poetomu nujno otpravit pustoy obyekt
  } 

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl1 + 'users/' + userId + '/photos/' + id);
  }
}

      // Observable<PaginatedResult<User[]>> --> vmesto
   // vozvrashat array userov
    //const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    // let params = new HttpParams();

    // if(page != null && itemsPerPage != null ) {
    //   params = params.append('pageNumber', page);
    //   params = params.append('pageSize', itemsPerPage);
    // }
 
    // return this.http.get<User[]>(this.baseUrl1 + 'users', { observe: 'response', params}).pipe
    // (
    //   map(response => {
    //     paginatedResult.result = response.body;
    //     if (response.headers.get('Pagination') != null) {
    //       paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
    //     }
    //     return paginatedResult;
    //   })
    // )