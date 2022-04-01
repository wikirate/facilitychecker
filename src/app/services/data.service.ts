import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class DataService {
  wikirateApiHost = "https://wikirate.org"
  facility_checker = {
    metrics: {
      facility_details: {
        number_of_workers: 4780588,
        female_workers: 3233894,
        wage: 6019687,
        gap: 7347357
      },
      supplier_of: 2929015,
      has_brands: 5768810,
      public_commitment: 7616258
    }
  }

  constructor(private httpClient: HttpClient) {
  }

  getAnswers(company_id: number, metrics: any, year: string | number) {
    const url = `${this.wikirateApiHost}/~${company_id}+Answer/compact.json`;
    let params = new HttpParams();
    for (var key of Object.keys(metrics)) {
      params = params.append("filter[metric_id][]", metrics[key])
    }
    params = params.append("filter[year]", year)

    return this.httpClient.get<any>(url, {params: params})
  }

  getRelationshipAnswers(company_id: number, metric_id: number) {
    const url = `${this.wikirateApiHost}/~${metric_id}+Relationship_Answer.json`;
    let params = new HttpParams();
    params = params.append("filter[company_id]", company_id)
    params = params.append("limit", 999)

    return this.httpClient.get<any>(url, {params: params})
  }
}
