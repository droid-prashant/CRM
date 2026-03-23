import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { Observable } from 'rxjs';
import { RestaurantDTO } from '@/shared/dynamic-form/models/restaurants/restaurant.dto';

@Injectable()
export class ApiService {
    constructor(private _http: HttpClient, private _endPoint: EndPointService) { }

    postRestaurant(formData: FormData) {
        return this._http.post<void>(this._endPoint._postRestaurant, formData).pipe((res: Observable<void>) => { return res; });
    }
    getAllRestaurants() {
        return this._http.get<RestaurantDTO[]>(this._endPoint._getAllRestaurants).pipe((res: Observable<RestaurantDTO[]>) => { return res; });
    }
}
