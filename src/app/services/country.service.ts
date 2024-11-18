import {Injectable} from "@angular/core";
import {Filter} from "../models/filter.model";
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class CountryService {
  private countries: string[] = [];
  private wikirateApiHost: string = "https://wikirate.org"

  constructor(private httpClient: HttpClient) {
  }

  getCountries() {
    return this.getAnswers(6126450, [new Filter('company_group','Apparel Suppliers')]);

    //return this.countries.slice().sort((c1, c2) => c1.name.localeCompare(c2.name));
  }

  getAnswers(metric_id: number, filters: Filter[]) {
    let url = `${this.wikirateApiHost}/~${metric_id}+Answer.json`
    let params = new HttpParams();
    for (let filter of filters) {
      params = params.append("filter[" + filter.name + "]", filter.value)
    }
    params = params.append("limit", 0)
    params = params.append("view", "answer_list")
    return this.httpClient.get<any>(url, {params: params})
  }
}
