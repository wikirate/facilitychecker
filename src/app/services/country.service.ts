// @ts-ignore
import countries from '../../assets/countries.json';
import {Injectable} from "@angular/core";
import {Country} from "../models/country.model";

@Injectable()
export class CountryService {
  private countries: Country[] = countries;

  getCountries() {
    return this.countries.slice().sort((c1, c2) => c1.name.localeCompare(c2.name));
  }
}
