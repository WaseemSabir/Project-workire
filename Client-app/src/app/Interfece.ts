import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Filters {
    search : string,
    country : string,
    company : string,
    category : string,
    days : number,
    page : number
};

export interface Job {
    title : string,
    id : number
};

export interface HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}