import {AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
  faArrowsLeftRightToLine,
  faBalanceScaleRight,
  faBuildingUser,
  faHandHoldingDollar, faMars, faMoneyCheckDollar,
  faVenus,
  faVenusMars,
  faArrowUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons";
import {Country} from "../models/country.model";
import {Facility} from "../models/facility.model";
import {distinctUntilChanged, filter, map, Observable, of, OperatorFunction} from "rxjs";
import {CountryService} from "../services/country.service";
import {FacilitiesService} from "../services/facilities.service";
import {ChartsService} from "../services/charts.service";
import {DataService} from "../services/data.service";
import {BrandsService} from "../services/brands.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

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
  externalLinkIcon = faArrowUpRightFromSquare;

  title = 'FASHION FACILITY CHECKER';
  searchTerm = '';
  submittedTerm = '';
  selectedCountry = '';
  page = 1;
  countries: string[] = [];
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
              private route: ActivatedRoute,
              public translate: TranslateService) {
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    this.faciltiesSize = this.facilitiesService.getSize(this.searchTerm, this.selectedCountry);
  }

  clear(selectElement: HTMLSelectElement) {
    selectElement.selectedIndex = 0;
    this.collapsableElements.forEach(item => {
      item.nativeElement.className = 'accordion-collapse collapse'
    })
    this.accordionButtons.forEach(button => {
      button.nativeElement.setAttribute('aria-expanded', false)
      button.nativeElement.className = 'accordion-toggle collapsed'
    })
    this.page = 1;
    this.selectedCountry = ''
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    this.faciltiesSize = this.facilitiesService.getSize(this.searchTerm, this.selectedCountry);
    this.facilityDetails = {}
    this.searchTerm = ''
    this.submittedTerm = ''
  }

  onPageSelect() {
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    if (this.facilities.length == 0) {
      this.facilities = this.facilitiesService.searchByOARID(this.searchTerm, this.selectedCountry, this.page);
      if (this.facilities.length > 0) this.selectedCountry = '';
    }
    this.facilityDetails = {}
  }

  onSearch() {
    this.page = 1
    this.collapsableElements.forEach(item => {
      item.nativeElement.className = 'accordion-collapse collapse'
    })
    this.facilities = this.facilitiesService.getFacilities(this.searchTerm, this.selectedCountry, this.page);
    if (this.facilities.length == 0) {
      this.facilities = this.facilitiesService.searchByOARID(this.searchTerm, this.selectedCountry, this.page);
      this.faciltiesSize = this.facilitiesService.getSearchByOARIDSize(this.searchTerm, this.selectedCountry);
      if (this.faciltiesSize > 0) this.selectedCountry = '';
    } else {
      this.faciltiesSize = this.facilitiesService.getSize(this.searchTerm, this.selectedCountry);
    }
    this.facilityDetails = {}
    this.submittedTerm = this.searchTerm;
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
              70, 70, ["#c6dcee", "#72a8d6"], {
                renderer: "svg", actions: false
              })
          }

          if (this.facilityDetails['facility-' + facility_id].hasOwnProperty(this.dataService.facility_checker.metrics.facility_details.gap)) {
            var actual_wage: number = (Math.round(this.facilityDetails['facility-' + facility_id][this.dataService.facility_checker.metrics.facility_details.gap])) / 100
            this.charts.drawBarChart("Living Wage Gap", "div#wage-gap-pie-" + facility_id,
              [{name: "Actual", value: actual_wage}, {name: ["Living", "wage"], value: 1}],
              90, 65, ["#72a8d6", "#27282a"], {
                renderer: "svg", actions: false
              })
          }

          this.dataService.getRelationshipAnswers(facility_id, this.dataService.facility_checker.metrics.supplied_by).subscribe(data => {
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
    this.countryService.getCountries().subscribe((data) => {
      // @ts-ignore
      this.countries = [...new Set(data.map((item: { [x: string]: any; }) => {
        return item['value'];
      }))].filter(v => v != null);
    });
  }
}
