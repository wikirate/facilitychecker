// @ts-ignore
import cached_brands from '../../assets/brands.json';
import {Injectable} from "@angular/core";

@Injectable()
export class BrandsService {
  private cached_brands: any[] = cached_brands.items
  private brands: any = {};

  constructor() {
    for (let i = 0; i < this.cached_brands.length; i++) {
      if (this.brands.hasOwnProperty(this.cached_brands[i]['subject_company'])) {
        this.brands[this.cached_brands[i]['subject_company']].push([this.cached_brands[i]['object_company']])
      } else {
        this.brands[this.cached_brands[i]['subject_company']] = [this.cached_brands[i]['object_company']]
      }
    }

  }

  getBrands(company: string) {
    if (this.brands.hasOwnProperty(company)) {
      return this.brands[company]
    } else {
      return '-'
    }
  }
}
