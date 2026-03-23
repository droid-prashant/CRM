import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestaurantDTO } from '@/shared/dynamic-form/models/restaurants/restaurant.dto';
import { InventoryEndPointService } from './inventory.endpoint.service';

@Injectable()
export class InventoryApiService {
    constructor(private _http: HttpClient, private _endPoint: InventoryEndPointService) { }

    postProduct(productData: FormData): Observable<any> {
        return this._http.post(`${this._endPoint._addProduct}`, productData);
    }

    getAllProducts() {
        return this._http.get<RestaurantDTO[]>(this._endPoint._getAllProducts).pipe((res: Observable<RestaurantDTO[]>) => { return res; });
    }
}
