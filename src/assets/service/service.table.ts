import { Injectable } from '@angular/core';
import { queryFields, link } from "@ressources/text-items";

@Injectable({
  providedIn: 'root',
})

export class ServiceTable {
  public nameField: string;
  public planLinkLang: string;
  public parcelFcField: string;
  public remainderField: string;
  public projectLinkLang: string;
  public mapView: any;

  private base = "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/";
  private urlException: {[key: string]: string} = {
    "36011": "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/ab/BANFF_NATIONAL_PARK_OF_CANADA/", 
    "FIELD": "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/BC/YOHO_NATIONAL_PARK_OF_CANADA/", 
    "36013": "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/AB/JASPER_NATIONAL_PARK_OF_CANADA/",
    "36015": "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/AB/BANFF_NATIONAL_PARK_OF_CANADA/",
    "WASAGAMING": "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/MB/RIDING_MOUNTAIN_NATIONAL_PARK_OF_CANADA/",
    "35013": "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/SK/PRINCE_ALBERT_NATIONAL_PARK_OF_CANADA/", 
    "36014": "https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets/AB/WATERTON_LAKES_NATIONAL_PARK_OF_CANADA/"
  };

  constructor() {
    this.nameField = queryFields.nameField;
    this.parcelFcField = queryFields.parcelFcField;
    this.remainderField = queryFields.remainderField;
    this.planLinkLang = link.planLink;
    this.projectLinkLang = link.projectLink;
  }

  setMapApi(mapView: any) {
    this.mapView = mapView;
  }

  get mapapi() {
    return this.mapView;
  }

  getUrlTownshite(): {[key: string]: string} {
    return this.urlException;
  }

  openSelectedMenu(tabMenu: string) {
    let tabContent = <HTMLElement>document.getElementById(tabMenu);
    let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>;
    tabContent.classList.remove("hidden");

    if (tabContentActive.length > 0) {
      tabContentActive[0].style.display = "none";
      tabContentActive[0].classList.remove("active")
    }

    tabContent.className+= ' active';
    tabContent.style.display = "block";
  }

  removeDuplicates(array: any, key: string): any {
    return array.reduce((arr: any, item: any) => {
      const removed = arr.filter((i: any) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };

  getDatasetUrl(prov: string, zone: string, name: string, admin: string): string {
    let url = this.getUrlTownshite();

    if (url[admin]) {
      return url[admin]
    }
    else {
      if ((prov === 'NT') || (prov === 'YT') || (prov === 'NU')) {
        return this.base + prov + '/Zone' + zone.split('TM')[1];
      }
      else {
        name = name.replace(/\.|\,|\'|\?/g,"");
        name = name.replace(/ /g, "_");
        name = name.replace(/#/g, "NO");
        name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  
        return this.base + prov + "/" + name + "/";
      }
    }
  }

  setAdminResults(results: __esri.FeatureSet, total: number): Array<any> {
    let queryResult = [];

    for (let i = 0; i < total; i++) {
      let name = results.features[i].attributes[this.nameField];
      let id = results.features[i].attributes.GlobalID;
      let prov = results.features[i].attributes.PROVINCE.split(' ')[0]
      let source = results.features[i].attributes.SOURCEDB;
      let admin = results.features[i].attributes.ADMINAREAID;

      queryResult.push({
        name: name,
        globalId: id,
        province: prov,
        url: this.getDatasetUrl(prov, source, results.features[i].attributes['ENGLISHNAME'], admin)
      })
    }

    return this.removeDuplicates(queryResult, 'name');
  }
  
  setParcelResults(results: __esri.FeatureSet, total: number): Array<any> {
    let queryResult = [];

    for (let i = 0; i < total; i++) {
      queryResult.push({
        parcelName: results.features[i].attributes.PARCELDESIGNATOR,
        remainder: results.features[i].attributes[this.remainderField],
        planNumber: results.features[i].attributes.PLANNO,
        planDetail: 'https://clss.nrcan-rncan.gc.ca/plan-' + this.planLinkLang +'.php?id=' + results.features[i].attributes.PLANNO.replace(/\s/g, '%20'),
        parcelType: results.features[i].attributes[this.parcelFcField],
        globalId: results.features[i].attributes.GlobalID,
        province: results.features[i].attributes.PROVINCE,
      })
    }
    return queryResult;
  }

  setTownshipResults(results: __esri.FeatureSet, total: number): Array<any> {
    let queryResult = [];

    for (let i = 0; i < total; i++) {
      queryResult.push({
        sectionName: results.features[i].attributes.TOWNSHIPSECTION,
        townshipName: results.features[i].attributes.TP,
        range: results.features[i].attributes.RANGE,
        meridian: results.features[i].attributes.MERIDIAN,
        globalId: results.features[i].attributes.GlobalID,
        province: results.features[i].attributes.PROVINCE,
        direction: results.features[i].attributes.DIRECTION,
      })
    }
    return queryResult;
  }

  setPlanResults(results: __esri.FeatureSet, total: number): Array<any> {
    let queryResult = [];

    for (let i = 0; i < total; i++) {
      queryResult.push({
        planNumber: results.features[i].attributes.PLANNO,
        description: results.features[i].attributes.P2_DESCRIPTION, 
        dateSurvey: results.features[i].attributes.P3_DATESURVEYED,
        planDetail: 'https://clss.nrcan-rncan.gc.ca/plan-' + this.planLinkLang +'.php?id=' + results.features[i].attributes.PLANNO.replace(/\s/g, '%20'),
        planLTO: results.features[i].attributes.ALTERNATEPLANNO,
        globalId: results.features[i].attributes.GlobalID,
        province: results.features[i].attributes.PROVINCE,
      })
    }
    return queryResult;
  }

  setProjectResults(results: __esri.FeatureSet, total: number): Array<any> {
    let queryResult = [];

    for (let i = 0; i < total; i++) {
      queryResult.push({
        projectNumber: results.features[i].attributes.PROJECTNUMBER,
        description: results.features[i].attributes.DESCRIPTION,
        projectDetail: 'https://clss.nrcan-rncan.gc.ca/' + this.projectLinkLang + '/project-projet/detail?id=' + results.features[i].attributes.URL,
        globalId: results.features[i].attributes.GlobalID,
        province: results.features[i].attributes.PROVINCE,
      })
    }
    return queryResult;
  }

  ngAfterViewInit() { }
}
