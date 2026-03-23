export interface ProductDto {
  id: number;
  name: string;
  image?: string;
  rate: number;
  city: string;
  street:string;
  description: string;
  numberOfFavorites: number;
  numberOfReviews: number;
}