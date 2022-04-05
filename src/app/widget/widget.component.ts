import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
  faArrowsLeftRightToLine,
  faBalanceScaleRight,
  faBuildingUser,
  faHandHoldingDollar, faMars, faMoneyCheckDollar,
  faVenus,
  faVenusMars
} from "@fortawesome/free-solid-svg-icons";
import {Country} from "../models/country.model";
import {Facility} from "../models/facility.model";
import {distinctUntilChanged, map, Observable, OperatorFunction} from "rxjs";
import {CountryService} from "../services/country.service";
import {FacilitiesService} from "../services/facilities.service";
import {ChartsService} from "../services/charts.service";
import {DataService} from "../services/data.service";
import {BrandsService} from "../services/brands.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {

  @ViewChildren('collapsableElement') collapsableElements!: QueryList<ElementRef>;
  @ViewChildren('collapseButton') accordionButtons!: QueryList<ElementRef>;

  wageIcon = faHandHoldingDollar;
  wageGapIcon = faBalanceScaleRight;
  workersIcon = faBuildingUser;
  genderIcon = faVenusMars;
  femaleIcon = faVenus;
  maleIcon = faMars;
  actualWageIcon = faMoneyCheckDollar
  gapIcon = faArrowsLeftRightToLine

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
  view: string = 'default'

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.facilitiesService.search(term, this.selectedCountry))
    )

  constructor(private countryService: CountryService,
              private facilitiesService: FacilitiesService,
              public charts: ChartsService,
              private dataService: DataService,
              private brandsService: BrandsService,
              private route: ActivatedRoute) {
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
      this.dataService.getAnswersPerCompany(facility_id, this.dataService.facility_checker.metrics.facility_details, 'latest')
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
              60, 60, ["#c6dcee", "#72a8d6"], {
                renderer: "svg", actions: false
              })
          }

          if (this.facilityDetails['facility-' + facility_id].hasOwnProperty(this.dataService.facility_checker.metrics.facility_details.gap)) {
            var actual_wage: number = Math.round(this.facilityDetails['facility-' + facility_id][this.dataService.facility_checker.metrics.facility_details.gap])
            var gap: number = 100 - actual_wage;
            this.charts.drawPieChart("Living Wage Gap", "div#wage-gap-pie-" + facility_id,
              [{name: "Actual wage", value: actual_wage}, {name: "Wage gap", value: gap}],
              60, 60, ["#72a8d6", "#27282a"], {
                renderer: "svg", actions: false
              })
          }

          this.dataService.getRelationshipAnswers(facility_id, this.dataService.facility_checker.metrics.supplier_of).subscribe(data => {
            var supplier_of: any = {}
            var companies: any = {}
            for (let item of data['items']) {
              if (supplier_of.hasOwnProperty(item['subject_company'])) {
                supplier_of[item['subject_company']]['years'].push(item['year'])
              } else {
                supplier_of[item['subject_company']] = {}
                supplier_of[item['subject_company']] ['id'] = item['subject_company_id']
                companies[item['subject_company_id']] = item['subject_company']
                supplier_of[item['subject_company']]['years'] = [item['year']];
              }
            }

            this.dataService.getAnswersPerMetric(7616258, Object.keys(companies), 'latest').subscribe(data => {
              if (Object.keys(data['answers']).length === 0) {
              } else {
                var public_commitment: any = {}
                for (let key of Object.keys(data['answers'])) {
                  public_commitment[companies[data['answers'][key]['company']]] = data['answers'][key]['value']
                }
                var brandInfo: any = []
                for (let brandName in supplier_of) {
                  var years: number[] = supplier_of[brandName]['years']
                  years.sort((n1, n2) =>
                    n2 - n1
                  )
                  brandInfo.push({
                    name: brandName,
                    years: years,
                    commitment: public_commitment[brandName],
                    brands: this.brandsService.getBrands(brandName)
                  })
                }
                this.facilityDetails['facility-' + facility_id][this.dataService.facility_checker.metrics.supplier_of] = brandInfo
              }
            })
          })
        });
    }
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          // @ts-ignore
          this.view = params.view;
        }
      );
  }
}
