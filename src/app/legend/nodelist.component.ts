import { Component, Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { legendTextElem, legendViewElem } from "@ressources/index";
import { legendLayerGroups } from "../ressources/legendGroup";

/**
 * @title List with selection for legend
 */
@Component({
  selector: 'list-selection-example',
  styleUrls: ['./nodelist.component.css'],
  templateUrl: './nodelist.component.html',
})

@Injectable({
  providedIn: 'root',
})

export class ListSelectionExample {
  private mapImage: any;
  public tabsOpened: boolean = false;

  tabToggle = [
    {value: [59], viewValue: legendViewElem.tabToggle, image: "./assets/images/legend-1-2.png", description: legendTextElem.allTabsButton, select: false, disable: false},
  ];

  selectAll = [
    {value: [0], colour: true, viewValue: legendViewElem.allToggle, image: "./assets/images/legend-758.png", description: legendTextElem.allButton, select: false, disable: false},
  ];
  
  itemsText = [
    {value: [1,2], viewValue: legendViewElem.text, image: "./assets/images/legend-1.png", description: legendTextElem.anno, select: true, service: "anno", disable: false},
  ];

  basemapToggle = [
    {value: [], viewValue: legendViewElem.basemapToggle, image: "./assets/images/legend-3-2.png", description: legendTextElem.basemap, select: true, service: "anno", disable: false},
  ];

  itemsAncillaryLine = [
    {value: [0], viewValue: legendViewElem.archivedLine, image: "./assets/images/legend-747.png", description: legendTextElem.archivedSurveyLineDescription, select: true, service: "ancillary", disable: false},
    {value: [2], viewValue: legendViewElem.fieldNote, image: "./assets/images/legend-62.png", description: legendTextElem.fieldNoteDescription, select: true, service: "ancillary", disable: false},
    {value: [1], viewValue: legendViewElem.otherLine, image: "./assets/images/legend-64.png", description: legendTextElem.otherSurveyedLineDescription, select: true, service: "ancillary", disable: false},
  ];

  itemsSurveyInProgress = [
    {value: [0], viewValue: legendViewElem.provisionalLine, image: "./assets/images/legend-745.png", description: legendTextElem.provisionalLine, select: false, service: "sip", disable: false},
    {value: [1], viewValue: legendViewElem.sip, image: "./assets/images/legend-739.png", description: legendTextElem.projectEnv, select: true, service: "sip", disable: false},
  ];

  itemsMineralClaim = [
    {value: [2], viewValue: legendViewElem.mineralClaimParcel, image: "./assets/images/legend-735.png", description: legendTextElem.mineralClaimParcel, select: true, service: "claim", disable: false},
    {value: [0], viewValue: legendViewElem.placerClaimLine, image: "./assets/images/legend-744.png", description: legendTextElem.placerClaim, select: true, service: "claim", disable: false},
    {value: [1], viewValue: legendViewElem.mineralClaimLine, image: "./assets/images/legend-746.png", description: legendTextElem.mineralClaimLine, select: true, service: "claim", disable: false},
  ];

  itemsYukonFirstNation = legendLayerGroups["yfn"];

  itemsCreeNaskapi = legendLayerGroups["creena"];

  itemsOilAndGas = legendLayerGroups["oil"];

  itemsEasement = [
    {value: [0], viewValue: legendViewElem.easement, image: "./assets/images/legend-730.png", description: legendTextElem.easement, select: true, service: "easement", disable: false},
    {value: [1], viewValue: legendViewElem.easementOther, image: "./assets/images/legend-61.png", description: legendTextElem.easementOtherDescription, select: true, service: "easement", disable: false},
  ];

  itemsSettlementLand = legendLayerGroups["settlement"];

  itemsAdministrativeArea = legendLayerGroups["admin"];

  itemsParcel = legendLayerGroups["parcel"];

  itemsProtectedArea = [
    {value: [9], viewValue: legendViewElem.protected, image: "./assets/images/legend-737.png", description: legendTextElem.protectedArea, select: true, service: "admin", disable: false},
  ];

  itemsFirstNationLandManagement = [
    {value: [10], viewValue: legendViewElem.landCodeExlcusion, image: "./assets/images/legend-43.png", description: legendTextElem.landExclusionDescription, select: true, service: "admin", disable: false},
  ];

  constructor(private appComponent: AppComponent) {}

  open() {
    let tabContent = <HTMLElement>document.getElementById('legendContainer');
    tabContent.classList.remove("hidden");
  }

  changeLegendImage() {
    this.itemsParcel[4].image = "./assets/images/legend-738.png";
  }

  /*disappear() {
    let tabContent = <HTMLElement>document.getElementById('legendContainer');
    tabContent.classList.add("hidden");
  }*/

  change(valueList: number[], layer: string) {
    this.mapImage = this.appComponent.getMapLayer(layer);

    for (let number of valueList) {
      let isVisible = this.mapImage.findSublayerById(number).visible;
      this.mapImage.findSublayerById(number).visible = !isVisible;
    }
  }

  toggleBasemap() {
    let view = this.appComponent.getMapView();
    let isVisible = view.basemapView.baseLayerViews.items[0].visible;

    let baseCheck = <HTMLElement>document.getElementById('basemap-check') as any;
    let baseImage = <HTMLElement>document.getElementById('basemap-image') as any;

    let isChecked = baseCheck.checked;
    baseCheck.checked = !isChecked;

    for (let item of view.basemapView.baseLayerViews.items) {
      item.visible = !isVisible;
    } 

    if (view.basemapView.baseLayerViews.items[0].visible) {
      this.basemapToggle[0].image = "./assets/images/legend-3-2.png";
      baseImage.srcset = "./assets/images/legend-3-2.png";
    }
    else {
      this.basemapToggle[0].image = "./assets/images/legend-4-2.png";
      baseImage.srcset = "./assets/images/legend-4-2.png";
    }
  }

  /*toggleBasemap2() {
    let view = this.appComponent.getMapView();
    let isVisible = view.basemapView.baseLayerViews.items[0].visible;
    let nbBaseLayout = view.basemapView.baseLayerViews.items.length;
    let baseCheck = <HTMLElement>document.getElementById('basemap-check') as any;
    let baseImage = <HTMLElement>document.getElementById('basemap-image') as any;

    let isChecked = baseCheck.checked;
    baseCheck.checked = !isChecked;
      if (this.basemapToggle[0].select) {
        this.basemapToggle[0].image = "./assets/images/legend-3-2.png";
        //baseImage.srcset = "./assets/images/legend-3-2.png";
      }
      else {
        this.basemapToggle[0].image = "./assets/images/legend-4-2.png";
        //baseImage.srcset = "./assets/images/legend-4-2.png";
      }
  }*/

  allTabsToggle() {
    if (this.tabsOpened) {
      this.tabToggle[0].image = "./assets/images/legend-1-2.png";
      this.tabsOpened = false;
    }
    else {
      this.tabToggle[0].image = "./assets/images/legend-2-2.png";
      this.tabsOpened = true;
    }
    
    let layerList = document.getElementById('legend_group')?.childNodes as any;

    if (layerList.length > 0) {
      layerList.forEach((item: any) => {
        item.open = this.tabsOpened;
      });
    }
  }
}
