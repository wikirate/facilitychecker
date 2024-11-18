import { HttpClient, HttpParams } from "@angular/common/http";
import {Injectable} from "@angular/core";

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
      supplied_by: 2929009,
      has_brands: 5768810,
      public_commitment: 7616258
    }
  }

  constructor(private httpClient: HttpClient) {
  }

  getAnswersPerCompany(company_id: number, metrics: any, year: string | number) {
    const url = `${this.wikirateApiHost}/~${company_id}+Answer/compact.json`;
    let params = new HttpParams();
    for (var key of Object.keys(metrics)) {
      params = params.append("filter[metric_id][]", metrics[key])
    }
    params = params.append("filter[year]", year)

    return this.httpClient.get<any>(url, {params: params})
  }

  getAnswersPerMetric(metric_id: number, companies: any, year: string | number) {
    const url = `${this.wikirateApiHost}/~${metric_id}+Answer/compact.json`;
    let params = new HttpParams();
    for (var key of Object.keys(companies)) {
      params = params.append("filter[company_id][]", companies[key])
    }
    params = params.append("filter[year]", year)
    params = params.append('limit', 100)
    return this.httpClient.get<any>(url, {params: params})
  }


  getRelationshipAnswers(company_id: number, metric_id: number) {
    const url = `${this.wikirateApiHost}/~${metric_id}+Relationship_Answer.json`;
    let params = new HttpParams();
    params = params.append("filter[object_company_id]", company_id)
    params = params.append("limit", 999)

    return this.httpClient.get<any>(url, {params: params})
  }
}
