import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl1 = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl1 + 'users', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }


// baseUrl1 = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   getUsers(likeParams?): Observable<User[]>  {     
  
//     var params = new HttpParams();

//     if(likeParams === 'Likers') {
//       params = params.append('likers', 'true')
//     }

//     if(likeParams === 'Likees') {
//       params = params.append('likees', 'true')
//     }

//     return this.http.get<User[]>(this.baseUrl1 + 'users/');

//   }

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

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl1 + 'users/' + id + '/like/' + recipientId, {});
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