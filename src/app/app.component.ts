import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CountryService} from "./services/country.service";
import {Country} from "./models/country.model";
import {FacilitiesService} from "./services/facilities.service";
import {Facility} from "./models/facility.model";
import {distinctUntilChanged, map, Observable, OperatorFunction} from "rxjs";
import {ChartsService} from "./services/charts.service";
import {DataService} from "./services/data.service";
import { faHandHoldingDollar, faBalanceScaleRight, faBuildingUser, faPersonHalfDress, faPersonDress, faPerson } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChildren('collapsableElement') collapsableElements!: QueryList<ElementRef>;
  @ViewChildren('collapseButton') accordionButtons!: QueryList<ElementRef>;

  wageIcon = faHandHoldingDollar;
  wageGapIcon = faBalanceScaleRight;
  workersIcon = faBuildingUser;
  genderIcon = faPersonHalfDress;
  femaleIcon = faPersonDress;
  maleIcon = faPerson;

  title = 'FASHION FACILITY CHECKER';
  searchTerm = '';
  selectedCountry = '';
  page = 1;
  countries: Country[] = [];
  facilities: Facility[] = [];
  faciltiesSize: number = 0;
  pages = [1, 2, 3]
  autocompleteResults: Facility[] = [];
  pageSize = 10;
  facilityDetails: any = {}

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.facilitiesService.search(term, this.selectedCountry))
    )

  constructor(private countryService: CountryService,
              private facilitiesService: FacilitiesService,
              public charts: ChartsService,
              private dataService: DataService) {
    this.countries = countryService.getCountries();
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    this.faciltiesSize = this.facilitiesService.getSize(this.searchTerm, this.selectedCountry);
  }

  clearCountrySelection(selectElement: HTMLSelectElement) {
    selectElement.selectedIndex = 0;
    this.collapsableElements.forEach(item => {
      item.nativeElement.className = 'accordion-collapse collapse'
    })
    this.accordionButtons.forEach(button => {
      button.nativeElement.setAttribute('aria-expanded', false)
      button.nativeElement.className = 'col-1 accordion-button collapsed'
    })
    this.page = 1;
    this.selectedCountry = ''
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    this.faciltiesSize = this.facilitiesService.getSize(this.searchTerm, this.selectedCountry);
    this.facilityDetails = {}
  }

  onPageSelect() {
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    this.faciltiesSize = this.facilitiesService.getSize(this.searchTerm, this.selectedCountry);
    this.facilityDetails = {}
  }

  onSearch() {
    this.page = 1
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    this.faciltiesSize = this.facilitiesService.getSize(this.searchTerm, this.selectedCountry);
    this.facilityDetails = {}
  }

  onMoreDetails(facility_id: number) {
    if (this.facilityDetails['facility-' + facility_id] === undefined) {
      this.facilityDetails['facility-' + facility_id]
      this.facilityDetails['facility-' + facility_id] = {};
      this.dataService.getAnswers(facility_id, this.dataService.facility_checker.metrics.facility_details, 'latest')
        .subscribe(data => {
          if (Object.keys(data['answers']).length === 0) {
          } else {
            for (let key of Object.keys(data['answers'])) {
              this.facilityDetails['facility-' + facility_id][data['answers'][key]['metric']] = data['answers'][key]['value']
            }
          }

          if (this.facilityDetails['facility-' + facility_id].hasOwnProperty(this.dataService.facility_checker.metrics.facility_details.female_workers)) {
            var female_workers: number = Math.round(this.facilityDetails['facility-' + facility_id][this.dataService.facility_checker.metrics.facility_details.female_workers])
            var male_workers = 100 - female_workers
            this.charts.drawPieChart("Male & Female workers", "div#workers-pie-" + facility_id,
              [{name: "Female workers", value: female_workers}, {name: "Male workers", value: male_workers}],
              60, 60, ["#fb4223", "#f9fe9c", "#1d1d2f"], {
                renderer: "svg", actions: false
              })
          }

          if (this.facilityDetails['facility-' + facility_id].hasOwnProperty(this.dataService.facility_checker.metrics.facility_details.gap)) {
            var actual_wage: number = Math.round(this.facilityDetails['facility-' + facility_id][this.dataService.facility_checker.metrics.facility_details.gap])
            var gap: number = 100 - actual_wage;
            this.charts.drawPieChart("Living Wage Gap", "div#wage-gap-pie-" + facility_id,
              [{name: "Actual wage", value: actual_wage}, {name: "Wage gap", value: gap}],
              60, 60, ["#f9fe9c", "#000000"], {
                renderer: "svg", actions: false
              })
          }

          this.dataService.getRelationshipAnswers(facility_id, this.dataService.facility_checker.metrics.supplier_of).subscribe(data => {
            var supplier_of: any = {}
            for (let item of data['items']) {
              if (supplier_of.hasOwnProperty(item['subject_company'])) {
                supplier_of[item['subject_company']].push(item['year'])
              } else {
                supplier_of[item['subject_company']] = [item['year']];
              }
            }

            var brandInfo: any = []
            for (let brandName in supplier_of) {
              var years: number[] = supplier_of[brandName]
              years.sort((n1, n2) =>
                n2 - n1
              )
              brandInfo.push({name: brandName, years: years})
            }
            this.facilityDetails['facility-' + facility_id][this.dataService.facility_checker.metrics.supplier_of] = brandInfo
          })
        });
    }
  }
}
