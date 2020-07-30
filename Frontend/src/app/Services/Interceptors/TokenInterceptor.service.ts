import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('INTERCEPTED');

    // We retrieve the token, if any

    var token = localStorage.getItem('token') ;
    let newHeaders = req.headers;
    if (token) {
       // If we have a token, we append it to our new headers
       req = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`
        }
      });
    }

    // Then we return an Observable that will run the request
    // or pass it to the next interceptor if any
    return next.handle(req);
  }

}
