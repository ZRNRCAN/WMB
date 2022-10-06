import Query from "@arcgis/core/rest/support/Query";
import * as RestQuery from "@arcgis/core/rest/query";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import Expand from '@arcgis/core/widgets/Expand';

import { Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { menuElem, adminElem, searchOptions, widgetText } from "@ressources/index";
import { ServiceTable, ServiceData, ZoomToElement, optionList, inputList, provinceList } from "@ressources/index";

import { exportToCsv } from '@shared/export-element';
import { csvHeaders } from '@ressources/text-items';

import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, Injectable, ViewChildren, QueryList } from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { MatExpansionPanel } from "@angular/material/expansion";
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from "@angular/material/select";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';

import { QueryProxy } from '../testing/test-function'
import { HttpClient } from '@angular/common/http';

interface RowSelection {
  name: string;
  province: string;
  globalId: string;
}
interface SelectElement {
  value: string;
  viewValue: string
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class SearchComponent {
  public category: any = {
    mainInput: false, //main
    NationInput: false, //first nations
    planInput: false, //planForParcel
    canLandInput: false, //canadaLand
    tpGroup: false, //township
    provSelect: false, //province
    adminGroup: false, //admin group
    ltoInput: false, // plan with lto
  };

  // Search box elements
  public  inputLabel: string;
  public  inputTitle: string;
  public  options: Array<any> = optionList;
  public  provinces: Array<any>;
  public  form: FormGroup;
  public  filteredOptionsNation: Observable<any>;
  public  filteredOptionsLand: Observable<any>;
  public  menuListItems: any;
  public  adminElements: any = adminElem;
  private allProvinces: Array<any>;
  private allMenuListItems: Array<any>;
  private searchOption: number;
  private initialValues: object;
  private searchType: string;
  private step: number = 0;
  private zoom: any;

  // Selected provinces by user
  public selectedProv: Array<any>;
  public selectedDirection: string;
  public selectedAdminType: Array<any>;

  // Query search and field elements
  private where: string;
  private wmbQueryUrl: string;
  private outFields: Array<string>;
  public selection = new SelectionModel<RowSelection>(true, []);

  // Results table elements
  public isCloseClicked: boolean = false;
  public dataSourceAdmin: MatTableDataSource<any>;
  public dataSourceProject: MatTableDataSource<any>;
  public dataSourcePlan: MatTableDataSource<any>;
  public dataSourceTown: MatTableDataSource<any>;
  public dataSourceParcel: MatTableDataSource<any>;

  @ViewChild('matExpansionPanel', {static: true}) matExpansionPanelElement: MatExpansionPanel;

  @ViewChild('adminTable') adminTable: MatTable<any>;
  @ViewChild('parcelTable') parcelTable: MatTable<any>;
  @ViewChild('planTable') planTable: MatTable<any>;
  @ViewChild('projectTable') projectTable: MatTable<any>;
  @ViewChild('townTable') townTable: MatTable<any>;

  @ViewChild('planSort') planSort: MatSort;
  @ViewChild('projectSort') projectSort: MatSort;
  @ViewChild('townSort') townSort: MatSort;
  @ViewChild('adminSort') adminSort: MatSort;
  @ViewChild('parcelSort') parcelSort: MatSort;

  @ViewChild('planPaginator') planPaginator: MatPaginator;
  @ViewChild('projectPaginator') projectPaginator: MatPaginator;
  @ViewChild('townPaginator') townPaginator: MatPaginator;
  @ViewChild('adminPaginator') adminPaginator: MatPaginator;
  @ViewChild('parcelPaginator') parcelPaginator: MatPaginator;

  @ViewChildren(MatTable) tables: QueryList<any>;

  queryFct: any;

  constructor(private serviceTable: ServiceTable, private dataService: ServiceData, private httpClient: HttpClient) {
    this.form = new FormGroup({
      mainInput: new FormControl(''),
      planForParcel: new FormControl(''),
      lto: new FormControl(''),
      sectionInput: new FormControl ('', [Validators.min(1), Validators.max(36)]),
      townshipInput: new FormControl('', [Validators.min(1), Validators.max(126)]),
      rangeInput: new FormControl('', [Validators.min(1), Validators.max(33)]),
      meridianInput: new FormControl('', [Validators.min(1), Validators.max(6)]),
      firstNatControl: new FormControl(''),
      canadaLandControl: new FormControl(''),
    });

    this.initialValues = this.form.value;
    this.allMenuListItems = menuElem.slice();
    this.queryFct = new QueryProxy(httpClient);
  }

  private _filterNation(name: any): SelectElement[] {
    //const filterValue = name;
    //return firstNationList.filter((option: any) => 
    //  option.viewValue.toLowerCase().includes(filterValue)
    //);
    //let name = value.viewValue;

    if (name.length < 3) {
      return [];
    }

    let where = "DESCRIPTION_E+like+%27%25" + name.toUpperCase() + "%25%27";
    let url = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_Support/MapServer/2/query?where=" + where + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=DESCRIPTION_E%2C+FIRSTNATIONID&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=description_e&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson";

    return this.queryFct.getResults(url, ["DESCRIPTION_E", "FIRSTNATIONID"]).then((response: any) => {
      return response.data;
    });
  }

  private _filterLand(name: any): SelectElement[] {
    if (name.length < 3) {
      return [];
    }
    
    let where = "ENGLISHNAME+like+%27%25" + name.toUpperCase() + "%25%27";
    let fields = ["ENGLISHNAME", "ADMINAREAID"];

    if (document.documentElement.lang === 'fr-CA') {
      where = "FRENCHNAME+like+%27%25" + name.toUpperCase() + "%25%27";
      fields = ["FRENCHNAME", "ADMINAREAID"];
    }
    let url = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_Support/MapServer/0/query?where=" + where + "&outFields=" + fields[0] + "%2C+ADMINAREAID&returnGeometry=false&orderByFields=" + fields[0] + "&returnTrueCurves=false&f=pjson";

    return this.queryFct.getResults(url, fields).then((response: any) => {
      return response.data;
    });
    
    //const filterValue = name;
    //return canLandList.filter((option: any) =>
    // option.viewValue.toLowerCase().includes(filterValue)
    //);
  }

  openLink(url: string) {
    window.open(url, "_blank");
  }

  setMapApi(mapView: any) {
    const graphicsLayerSketch = new GraphicsLayer();

    let sketchDiv = <HTMLElement>document.getElementById("spatial-selection");

    let sketch = new Sketch({
      layer: graphicsLayerSketch,
      view: mapView,
      visibleElements: {
        createTools: {
          circle: false,
          polygon: false,
          point: false,
          polyline: false
        },
        selectionTools: {
          "lasso-selection": false,
          "rectangle-selection":false,
        },
        settingsMenu: false,
        undoRedoMenu: false,
      },
      creationMode: "update",
    });

    mapView.map.layers.push(graphicsLayerSketch);

    const sketchExpand = new Expand({
      expandIconClass: "esri-icon-cursor-marquee \ue90f",
      content: sketch,
      view: mapView,
      expanded: true,
      container: sketchDiv,
      id: "sketchExpand",
      expandTooltip: widgetText.spatialExpand,
      collapseTooltip: widgetText.spatialCollapse
    });

    mapView.ui.add(sketchExpand, "top-right");

    sketch.on("update", (event: any) => {
      this.searchType = "sketch";

      if (event.state === "start") {
        this.setSketchQuery(event.graphics[0].geometry);
        let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>
        let clickedTab = document.getElementsByClassName(' click');

        if (tabContentActive.length > 0) {
          tabContentActive[0].style.display = "none";
          tabContentActive[0].classList.remove("active");
        }
        if (clickedTab.length > 0) {
          for (let i = clickedTab.length-1; i >= 0; i--) {
            clickedTab[i].classList.remove("click");
          }
        }
        this.hideResultMessage();
        this.showResultLoading();
      }
      else if (event.state === "complete") {
        graphicsLayerSketch.remove(event.graphics[0]);
      }
      else if (
        event.toolEventInfo && (
        event.toolEventInfo.type === "scale-stop" || 
        event.toolEventInfo.type === "reshape-stop" || 
        event.toolEventInfo.type === "move-stop" ||
        event.toolEventInfo.type === "rotate-stop")
        ) {
          this.setSketchQuery(event.graphics[0].geometry);
          let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>;
          let clickedTab = document.getElementsByClassName(' click');

          if (tabContentActive.length > 0) {
            tabContentActive[0].style.display = "none";
            tabContentActive[0].classList.remove("active");
          }
          if (clickedTab.length > 0) {
            for (let i = clickedTab.length-1; i >= 0; i--) {
              clickedTab[i].classList.remove("click");
            }
          }
          this.hideResultMessage();
          this.showResultLoading();
        }
    });
  }

  displayValues(user: SelectElement): string {
    return user && user.value ? user.viewValue : '';
  }

  ngOnInit() {
    this.zoom = new ZoomToElement(this.serviceTable);

    this.allProvinces = provinceList.slice();

    this.filteredOptionsNation = this.firstNatControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(viewValue => {
          if (typeof(viewValue) === 'string') {
            return this._filterNation(viewValue);
          }
          else {
            return [];
          }
        })
      );

    this.filteredOptionsLand = this.canadaLandControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(viewValue => {
          if (typeof(viewValue) === 'string') {
            return this._filterLand(viewValue);
          }
          else {
            return [];
          }
        })       
      )}

  get mainInput(): string {
    return this.form.get('mainInput')?.value.toUpperCase();
  }
  get planForParcel(): string {
    return this.form.get('planForParcel')?.value.toUpperCase();
  }
  get lto(): string {
    return this.form.get('lto')?.value.toUpperCase();
  }
  get sectionInput(): number {
    return this.form.get('sectionInput')?.value;
  }
  get townshipInput(): number {
    return this.form.get('townshipInput')?.value;
  }
  get rangeInput(): number {
    return this.form.get('rangeInput')?.value;
  }
  get meridianInput(): number {
    return this.form.get('meridianInput')?.value;
  }
  get firstNatControl(): FormControl  {
    return this.form.controls['firstNatControl'] as FormControl;
  }
  get canadaLandControl(): FormControl  {
    return this.form.controls['canadaLandControl'] as FormControl;
  }

  resetSearchFormElem() {
    for(let key in this.category) {
      this.category[key] = false;
    }
  }

  setSearchFormElem(elemToSet: Array<string>) {
    for (let elem of elemToSet) {
      this.category[elem] = true;
    }
  }

  setSearchForm() {
    switch(this.searchOption) {
      case 0: //Community
      case 2: //Cree
      case 4: //Municipal
      case 5: //Park
      //Quad
      case 8: {
        this.setSearchFormElem(["mainInput", "provSelect"]);
        break;
      }
      // Indian Reserve
      case 3: {
        this.setSearchFormElem(["mainInput", "NationInput", "provSelect"]);
        break;
      }
      // Parcel
      case 6: {
        this.setSearchFormElem(["mainInput", "planInput", "canLandInput", "provSelect"]);
        break;
      }
      // Protected Area
      case 7: {
        this.setSearchFormElem(["mainInput", "planInput", "provSelect"]);
        break;
      }
      // Plan
      case 9:
        this.setSearchFormElem(["planInput", "canLandInput", "ltoInput", "provSelect"]);
        break;
      // Project
      case 10: {
        this.setSearchFormElem(["mainInput", "canLandInput", "provSelect"]);
        break;
      }
      // Township
      case 11: {
        this.setSearchFormElem(["tpGroup", "provSelect"]);
        break; 
      }
      // Admin Group
      case 12: {
        this.setSearchFormElem(["mainInput", "adminGroup", "provSelect"]);
        break; 
      }
      default:{
        break;
      }
    }
  }

  closeTable() {
    this.isCloseClicked = true;
    this.zoom.keepGraph = false;
    this.zoom.resetGraphGlobal();
  }

  openTable() {
    this.isCloseClicked = false;
    let tabContent = <HTMLElement>document.getElementById('tableResults');
    tabContent.classList.remove("hidden");
    tabContent.hidden = false;
  }

  showResultMessage() {
    let htmlText = <HTMLElement>document.getElementById("result-message");
    htmlText.hidden = false;
  }

  hideResultMessage() {
    let htmlText = <HTMLElement>document.getElementById("result-message");
    htmlText.hidden = true;
  }

  showResultLoading() {
    let htmlText = <HTMLElement>document.getElementById("result-spinner");
    htmlText.hidden = false;
  }
  
  hideResultLoading() {
    let htmlText = <HTMLElement>document.getElementById("result-spinner");
    htmlText.hidden = true;
  }
  
  clickMenuItem(id: string) {
    switch(id) {
      case "divAdmin": {
        this.openTab(id, this.adminSort, this.adminPaginator, this.adminTable);
        break;
      }
      case "divParcel": {
        this.openTab(id, this.parcelSort, this.parcelPaginator, this.parcelTable);
        break;
      }
      case "divTownship": {
        this.openTab(id, this.townSort, this.townPaginator, this.townTable);
        break;
      }
      case "divPlan": {
        this.openTab(id, this.planSort, this.planPaginator, this.planTable);
        break;
      }
      case "divProject": {
        this.openTab(id, this.projectSort, this.projectPaginator, this.projectTable);
        break;
      }
      default: break;
    }
  }

  checkTabState(id: string): boolean {
    let tab = <HTMLElement>document.getElementById(id);
    let classes = tab?.classList;
    let isRendered = classes?.contains('click');

    if (!isRendered) {
      tab?.classList.add('click');
    }
    return isRendered;
  }

  openTab(id: string, sort: MatSort, paginator: MatPaginator, table: MatTable<any>) {
    this.serviceTable.openSelectedMenu(id);
    let isRendered = this.checkTabState(id);

    if (!isRendered) {
      if (!this.zoom.keepGraph) {
        this.zoom.resetGraphGlobal();
      }
      this.zoom.keepGraph = true;

      let data = this.dataService.getData(id);
      let allData = [].concat.apply([], data);

      let dataSource = new MatTableDataSource(allData);
      dataSource.sort = sort;
      dataSource.paginator = paginator;

      table.dataSource = dataSource;
      table.renderRows();
    }
    this.hideResultMessage();
  }

  openMenu() {
    if (typeof this.menuListItems == 'undefined') {
      this.menuListItems = this.allMenuListItems;
    }
  }

  resetMenuTitle() {
    let copyMenuItems = this.allMenuListItems.slice();
    let arr = copyMenuItems.splice(0);
    this.initMenu(arr);

    for (let i = 0; i < arr.length; i++) {
      arr[i].total = 0;
      this.menuListItems[i].menuLinkText = arr[i].menuLinkText.split(" (")[0];
      this.menuListItems[i].isDisabled = true;
    }
  }

  setMenuTitle(totalOfResults: number, menuIndex: number) {
    let copyMenuItems = this.allMenuListItems.slice();
    let arr = copyMenuItems.splice(0);
    let menuString;
    
    // Total for admin (duplicate are removed)
    if (menuIndex == 4) {
      arr[menuIndex].total = totalOfResults;
    }
    // Total for project, plan, town, parcel
    else {
      arr[menuIndex].total += totalOfResults;
    }

    if (totalOfResults >= 1000) {
      menuString = `${arr[menuIndex].menuLinkText.split(" (")[0]} (1000+)`;
    }
    else {
      menuString = `${arr[menuIndex].menuLinkText.split(" (")[0]} (${arr[menuIndex].total})`;
    }

    this.menuListItems[menuIndex].menuLinkText = menuString;
    this.menuListItems[menuIndex].isDisabled = false;
    let htmlText = `${this.menuListItems[menuIndex].menuLinkText}`;
    let button: any;

    switch(menuIndex) {
      case 0: {
        button = <HTMLButtonElement>document.getElementById('parcelButton');
        break;
      }
      case 1: {
        button = <HTMLButtonElement>document.getElementById('projectButton');
        break;
      }
      case 2: {
        button = <HTMLButtonElement>document.getElementById('planButton');
        break;
      }
      case 3: {
        button = <HTMLButtonElement>document.getElementById('townButton');
        break;
      }
      case 4: {
        button = <HTMLButtonElement>document.getElementById('adminButton');
        break;
      }
      default:
        break;
    }
    button.innerText = htmlText;
    button.title = htmlText;

    this.step+= 1;
    if (this.step%10 === 0) {
      this.setLoadingTabs(false);
    }
  }
  //===========================================================================================================================//
  //===========================================================================================================================//
  resetButton() {
    this.selectedProv = [];
    this.selectedDirection = '';
    this.selectedAdminType = [];
    this.form.reset(this.initialValues);

    //this.canadaLandControl.reset({value: 'reset', viewValue: 'reset'});
    //this.firstNatControl.reset({value: '', viewValue: ''});

    if ([0,2,3,4,5,7].includes(this.searchOption)) {
      this.searchOption = 12;
      this.setQuery(12, true);}

    this.filterProv(searchOptions[12].filter);
  }

  initMenu(menuList: Array<any>) {
    this.menuListItems = menuList;
  }

  selectedValue(event: MatSelectChange) {
    // Reset form control
    this.selectedProv = [];
    this.selectedAdminType = [];
    this.form.reset(this.initialValues);

    // Set Param of expansion panel
    this.searchOption = event.value;
    this.inputLabel = inputList[event.value]['viewValue'];
    this.inputTitle = inputList[event.value]['title'];
    this.matExpansionPanelElement.expanded = true;
    this.matExpansionPanelElement.disabled = false;

    this.resetSearchFormElem();
    this.setSearchForm();
    this.setQuery(this.searchOption, true);
  }

  selectedAdminValue(event: MatSelectChange) {
    this.selectedProv = [];
    this.form.reset(this.initialValues);

    this.inputLabel = inputList[event.value]['viewValue'];
    this.inputTitle = inputList[event.value]['title'];
    this.searchOption = event.value;

    if (event.value === 3) {
      this.setSearchFormElem(["NationInput"]);
    }
    else if (event.value === 7) {
      this.category["NationInput"] = false;
      this.setSearchFormElem(["planInput"]);
    }
    else {
      this.category["NationInput"] = false;
      this.category["planInput"] = false;
    }
    this.setQuery(event.value, true);
  }

  removeByValue(arr: Array<any>, value: any) {
    let i = arr.length;
    while (i--) {
      if (arr[i] && arr[i].value === value) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }

  initProvince(provinceList: any) {
    this.provinces = provinceList;
  }

  /*filterProv(filterArr: Array<string>) {
    let copyProv = this.allProvinces.slice();
    for (let i = 0; i < filterArr.length; i++) {
      this.removeByValue(copyProv, filterArr[i]);
    }
    this.initProvince(copyProv);
  }*/

  filterProv(filterArr: Array<string>) {
    let copyProv = this.allProvinces.slice();

    for (let arr of filterArr) {
      this.removeByValue(copyProv, arr);
    }
    this.initProvince(copyProv);
  }

  setLoadingTabs(isLoading: boolean) {
    let tabs = document.getElementById('tabButton') as HTMLElement;
    let tabChildren = tabs.children as HTMLCollection;

    for (let i=0; i<tabChildren.length; i++) {
      let button = tabChildren.item(i) as HTMLButtonElement;

      if (isLoading) {
        button.disabled = true;
        button.style.cursor = 'progress';
      }
      else {
        button.disabled = false;
        button.style.cursor = 'pointer';
        this.showResultMessage();
        this.hideResultLoading();
      }
    }
  }

  setSketchQuery(geometry: __esri.Geometry) {
    this.dataService.removeData();
    this.resetSketchDataSource();
    this.resetMenuTitle();
    this.selection.clear();
    this.serviceTable.mapView.graphics.items = [];

    let searchOpt = [0, 2, 3, 4, 5, 6, 7, 9, 10, 11];
    this.executeForList(searchOpt, "", geometry);
    this.openTable();

    let tabs = <HTMLElement>document.getElementById("tabButton");
    tabs.hidden = false;
  }

  setQuery(option: number, isFilterByProv: boolean) {
    if (isFilterByProv) {
      this.filterProv(searchOptions[option].filter);
    }
    this.wmbQueryUrl = searchOptions[option].url;
    this.outFields = searchOptions[option].fields;
    this.where = this.outFields[0];
  }

  checkErrorAutocomplete(formCtrl: FormControl, list:any): boolean {
    if (formCtrl.value != "") {
      const index = list.findIndex((name: any) => {
        return name.viewValue === formCtrl.value.viewValue;
      });

      if (index < 0) {
        formCtrl.reset("");
        formCtrl.setErrors({'incorrect': true})
        return false;
      }
      else {
        return true;
      }
    }
    else {
      formCtrl.updateValueAndValidity();
      return true;
    }
  }

  checkForm(): boolean {
    /*let isNatValid = this.checkErrorAutocomplete(this.firstNatControl, firstNationList);
    let isLandValid = this.checkErrorAutocomplete(this.canadaLandControl, canLandList);
    let isFormValid = this.form.valid;

    if (isNatValid && isLandValid && isFormValid) {
      return true;
    }
    else {
      return false;
    }*/
    return true;
  }

  submitSearch() {
    this.searchType = "box";
    this.hideResultMessage();

    this.zoom.keepGraph = false;
    this.zoom.resetGraphGlobal();

    //let isSearchValid = this.checkForm();

    if (this.form.valid) {
      let whereOption = "";

      if (this.where == "TOWNSHIPSECTION" && this.form.value.sectionInput !== null && this.form.value.sectionInput !== '') {
        whereOption = `${this.where} = ${ this.sectionInput}`;
      }
      else if (this.where == "TOWNSHIPSECTION" && (this.form.value.sectionInput == null || this.form.value.sectionInput == '')) {
        whereOption = `${this.where} > 0`;
      }
      else {
        whereOption = `${this.where} LIKE '%${this.mainInput}%'`;
      }

      // Add province to search
      if (this.selectedProv.length === 1) {
        whereOption += ` AND PROVINCE LIKE '${this.selectedProv[0].toUpperCase()}%'`;
      }
      else if (this.selectedProv.length > 1) {
        whereOption += ` AND PROVINCE LIKE '${this.selectedProv[0].toUpperCase()}%'`;

        for (let i = 1; i < this.selectedProv.length; i++) {
          whereOption += ` OR PROVINCE LIKE '${this.selectedProv[i].toUpperCase()}%'`;
        }
      }

      // Add firstNation to search
      if (this.firstNatControl?.value) {
        whereOption += ` AND FIRSTNATION = '${this.firstNatControl.value.value}'`;
      }

      // Add plan number for parcel search
      if (this.form.value.planForParcel != "") {
        whereOption += ` AND PLANNO LIKE '%${this.planForParcel}%'`;
      }

      // Add lto for plan search
      if (this.form.value.lto != "") {
        whereOption += ` AND ALTERNATEPLANNO LIKE '%${this.lto}%'`;
      }

      // Add canada land
      if (this.canadaLandControl.value) {
        whereOption += ` AND GEOADMINCODE = '${this.canadaLandControl.value.value}'`;
      }

      // Add township number
      if (this.form.value.townshipInput != "" && this.form.value.townshipInput != null) {
        whereOption += ` AND TP = '${this.townshipInput}'`;
      }

      // Add range number
      if (this.form.value.rangeInput != "" && this.form.value.rangeInput != null) {
        whereOption += ` AND RANGE = ${this.rangeInput}`;
      }

      // Add meridian number
      if (this.form.value.meridianInput != "" && this.form.value.meridianInput != null) {
        whereOption += ` AND MERIDIAN = '${this.meridianInput}'`;
      }

      // Add direction to search
      if (this.selectedDirection) {
        whereOption += ` AND DIRECTION = '${this.selectedDirection}'`;
      }

      this.openTable();
      let tabButton = <HTMLElement>document.getElementById("tabButton");
      tabButton.hidden = true;

      this.resetBoxDataSource();
      this.resetMenuTitle();
      this.selection.clear();
      this.dataService.removeData();
      this.serviceTable.mapView.graphics.items = [];

      if (this.searchOption === 12) {
        this.executeForList([0,2,3,4,5,], whereOption);
      }
      else {
        this.executeQuery(whereOption, this.wmbQueryUrl, this.searchOption);
      }
    }
    else {
      this.matExpansionPanelElement.expanded = true;
    }
  }

  resetSketchDataSource() {  
    let sources = [this.dataSourceAdmin, this.dataSourceParcel, this.dataSourcePlan, this.dataSourceProject, this.dataSourceTown];
    for (let i = 0; i < 5; i++) {
      sources[i] = new MatTableDataSource();
    }
  }

  resetBoxDataSource() {
    this.tables.forEach((element: any) => {
      element.dataSource = new MatTableDataSource();
    });
  }
  
  async executeForList(list: Array<number>, where: string, geometry?: __esri.Geometry) {
    this.setLoadingTabs(true);
    
    for (let i of list) {
      this.setQuery(i, false);
      this.executeQuery(where, this.wmbQueryUrl, i, geometry);
    }
  }

  async executeSketchQuery(query: any, url: string, option: any): Promise<any> {
    const data = await RestQuery.executeQueryJSON(url, query);
    let menuItem;
    let totalResults = data.features.length;

    switch(option) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 8: {
        let adminData = this.serviceTable.setAdminResults(data, totalResults);
        let all: any = [].concat.apply([], this.dataService.getAdminData());
        totalResults = all.length;
        this.dataService.addAdminPost(adminData);
        menuItem = 4;
        break;
      }
      case 6:
      case 7: {
        let parcelData = this.serviceTable.setParcelResults(data, totalResults);
        this.dataService.addParcelPost(parcelData);
        menuItem = 0;
        break;
      }
      case 9: {
        let planData = this.serviceTable.setPlanResults(data, totalResults);
        this.dataService.addPlanPost(planData);
        menuItem = 2;
        break;
      }
      case 10: {
        let projectData = this.serviceTable.setProjectResults(data, totalResults);
        this.dataService.addProjectPost(projectData);
        menuItem = 1;
        break;
      }
      case 11: {
        let townshipData = this.serviceTable.setTownshipResults(data, totalResults);
        this.dataService.addTownPost(townshipData);
        menuItem = 3;
        break;
      }
      default:
        break
    }
    return Promise.resolve({
        total: totalResults,
        menu: menuItem,
      });
  }

  setSource(source: MatTableDataSource<any>, data: any, sort: MatSort, paginator: MatPaginator): MatTableDataSource<any> {
    source = new MatTableDataSource(data);
    source.sort = sort;
    paginator.pageIndex = 0;
    source.paginator = paginator;
    return source;
  }

  async executeSearchQuery(query: any, option: number): Promise<any> {
    const data = await RestQuery.executeQueryJSON(this.wmbQueryUrl, query);
    let menuItem;
    let totalResults = data.features.length;

    switch(option) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 8: {
        let adminData = this.serviceTable.setAdminResults(data, totalResults);
        this.dataService.addAdminPost(adminData);
        let all: any = [].concat.apply([], this.dataService.getAdminData());
        this.dataSourceAdmin = this.setSource(this.dataSourceAdmin, all, this.adminSort, this.adminPaginator);
        menuItem = 4;
        totalResults = all.length;
        break;
      }
      case 6:
      case 7: {
        let parcelData = this.serviceTable.setParcelResults(data, totalResults);
        this.dataSourceParcel = this.setSource(this.dataSourceParcel, parcelData, this.parcelSort, this.parcelPaginator);
        menuItem = 0;
        break;
      }
      case 9: {
        let planData = this.serviceTable.setPlanResults(data, totalResults);
        this.dataSourcePlan = this.setSource(this.dataSourcePlan, planData, this.planSort, this.planPaginator);
        menuItem = 2;
        break;
      }
      case 10: {
        let projectData = this.serviceTable.setProjectResults(data, totalResults);
        this.dataSourceProject = this.setSource(this.dataSourceProject, projectData, this.projectSort, this.projectPaginator);
        menuItem = 1;
        break;
      }
      case 11: {
        let townshipData = this.serviceTable.setTownshipResults(data, totalResults);
        this.dataSourceTown = this.setSource(this.dataSourceTown, townshipData, this.townSort, this.townPaginator);
        menuItem = 3;
        break;
      }
      default:
        break
    }
    return Promise.resolve({
        menu: menuItem,
        total: totalResults
      });
  }

  executeQuery(whereQuery: string, wmbQueryUrl: string, option: number, geometry?: any) {
    let query = new Query({
      returnGeometry: false,
      outFields: this.outFields,
      where: whereQuery,
      orderByFields: [this.where],
      returnDistinctValues: true,
    });

    if (geometry) {
      query.geometry = geometry;
    }

    this.showResultLoading();

    if (this.searchType === "box") {
      let tableResults = this.executeSearchQuery(query, option);

      tableResults.then((promise) => {
        this.setMenuTitle(promise.total, promise.menu);
        this.hideResultLoading();
        this.hideResultMessage();

        this.serviceTable.openSelectedMenu(searchOptions[this.searchOption].tab);
      })
    }
    else if (this.searchType === "sketch") {
      let tableResults = this.executeSketchQuery(query, wmbQueryUrl, option);

      tableResults.then((promise) => {
        this.setMenuTitle(promise.total, promise.menu);
      })
    }
  }

  zoomToElement(id: string, province: string) {
    this.zoom.getResult(province, id, 'click');
  }

  changeRowSelection(row: RowSelection, type?: string) {

    if (type === 'parcel') {
      this.zoom.setColor([13, 13, 12, 0.35], [252, 186, 3, 0.35]);
    }
    else {
      this.zoom.setColor([51, 255, 255], [125, 125, 125, 0.35]);
    }

    let isRowSelected = this.selection.isSelected(row);
    if (isRowSelected) {
      this.zoom.getResult(row.province, row.globalId, 'mouseover');
    }
    else {
      this.zoom.removeFeature(row.globalId);
    }
  }

  exportResult() {
    let results: any;
    let headers: string[] = [];

    const tabActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>;
    const id = tabActive[0].id;

    switch(id) {
      case 'divAdmin': {
        results = (this.adminTable.dataSource as MatTableDataSource<any>).data
        headers = csvHeaders.divAdmin
        break;
      }
      case 'divPlan': {
        results = (this.planTable.dataSource as MatTableDataSource<any>).data;
        headers = csvHeaders.divPlan
        break;
      }
      case 'divParcel': {
        results = (this.parcelTable.dataSource as MatTableDataSource<any>).data;
        headers = csvHeaders.divParcel
        break;
      }
      case 'divTownship': {
        results = (this.townTable.dataSource as MatTableDataSource<any>).data;
        headers = csvHeaders.divTownship
        break;
      }
      case 'divProject': {
        results = (this.projectTable.dataSource as MatTableDataSource<any>).data;
        headers = csvHeaders.divProject
        break;
      }
    }

    let filteredResults = results.map(function(item: any) {
      delete item.globalId
      return Object.keys(item).map((key) => item[key]);
    })

    exportToCsv('data.csv', filteredResults, headers);
  }

  ngAfterViewInit() {}
}
