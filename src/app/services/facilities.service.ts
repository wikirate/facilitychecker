// @ts-ignore
import facilities from '../../assets/ApparelSups.json';
import {Injectable} from "@angular/core";
import {Facility} from "../models/facility.model";
import {count} from "rxjs";

@Injectable()
export class FacilitiesService {
  private facilities: Facility[] = facilities;

  getFacilities(term: string, country: string, page: number) {
    if (term.trim() === '' && country === '') {
      return this.facilities.sort((c1, c2) => c1.answers < c2.answers?1:-1).slice((page - 1) * 10, page * 10);
    } else if (term.trim() !== '') {
      var regexp = new RegExp("\\b" + term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "i")
      return this.facilities.filter(f => {
        if (country === '')
          return regexp.test(f.name);
        else
          return regexp.test(f.name) && (f.headquarters === null || f.headquarters.toLowerCase().includes(country.toLowerCase()));
      }).slice((page - 1) * 10, page * 10)
    } else {
      return this.facilities.filter(f => {
        if (f.headquarters === null) {
          return false;
        }
        return f.headquarters.toLocaleLowerCase().includes(country.toLowerCase())
      }).slice((page - 1) * 10, page * 10);
    }
  }

  searchByOARID(term: string, country: string, page: number) {
    return this.facilities.filter(f => {
      return f.oar_id.toLowerCase().startsWith(term.toLowerCase());
    }).slice((page - 1) * 10, page * 10)
  }

  getSearchByOARIDSize(term: string, country: string) {
    return this.facilities.filter(f => {
      return f.oar_id.toLowerCase().startsWith(term.toLowerCase());
    }).length
  }

  getSize(term: string, country: string) {
    if (term.trim() === '' && country === '') {
      return this.facilities.length;
    } else if (term.trim() !== '') {
      var regexp = new RegExp("\\b" + term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "i")
      return this.facilities.filter(f => {
        if (country === '')
          return regexp.test(f.name);
        else
          return regexp.test(f.name) && (f.headquarters === null || f.headquarters.toLowerCase().includes(country.toLowerCase()));
      }).length
    } else {
      return this.facilities.filter(f => {
        if (f.headquarters === null) {
          return false;
        }
        return f.headquarters.toLocaleLowerCase().includes(country.toLowerCase())
      }).length;
    }
  }

  search(term: string, country: string) {
    var regexp = new RegExp("^\\b" + term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), "i")
    return this.facilities.filter(f => {
      if (country === '') {
        return regexp.test(f.name);
      } else {
        return regexp.test(f.name) && (f.headquarters !== null && f.headquarters.includes(country));
      }
    }).map(f => f.name).slice(0, 10);
  }

}
