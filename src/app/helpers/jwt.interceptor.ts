import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../models/linda/person'; 

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser:UserInterface = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser['token']) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser['token']}`
                }
            });
        }

        return next.handle(request);
    }
}


