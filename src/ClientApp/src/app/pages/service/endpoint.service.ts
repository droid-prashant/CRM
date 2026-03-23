import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EndPointService {
    //end point for Restaurant starts
    public readonly _postRestaurant: string = `${environment.apiUrl}/restaurant/createRestaurant`;
    public readonly _getAllRestaurants: string = `${environment.apiUrl}/restaurant/getAllRestaurants`;
    //end point for Restaurant ends
}
