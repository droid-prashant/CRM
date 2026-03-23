import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InventoryEndPointService {
    //end point for Product starts
    public readonly _addProduct: string = `${environment.apiUrl}/Product/AddProduct`;
    public readonly _getAllProducts: string = `${environment.apiUrl}/Product/GetAllProducts`;
    //end point for Product ends
}
