import { Component, OnInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { layerToSet } from "./ressources/services-params";
import { legendLayerGroups } from "./ressources/legendGroup";
import { widgetText, ServiceTable, helpSiteElement, ZoomToElement } from "@ressources/index";

// ArcGIS Widget //
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import Expand from '@arcgis/core/widgets/Expand';
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import Home from "@arcgis/core/widgets/Home";
import Measurement from '@arcgis/core/widgets/Measurement';
import Print from '@arcgis/core/widgets/Print';

// ArcGIS Core //
import Basemap from "@arcgis/core/Basemap";
import EsriMap from "@arcgis/core/Map";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import MapView from '@arcgis/core/views/MapView';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import TileLayer from "@arcgis/core/layers/TileLayer";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";

// Angular Component //
import { SearchComponent } from '@search/search.component';
import Logger from "js-logger";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, OnDestroy {
  public view: any = null;
  private isSatelliteActive: boolean = false;

  private scaleLevel: {[key: number]: number} = { 
    3: 65000000,
    4: 37000000,
    5: 18500000,
    6:  9244000,
    7:  4625000,
    8:  2300000,
    9:  1150000,
    10:  575000,
    11:  285000,
    12:  140000,
    13:   72500,
    14:   36000,
    15:   18000,
    16:    9000,
    17:    5000,
    18:    2000,
    19:    1000,
    20:     500
  }

  canUrl: any;
  projUrl: any;
  plnUrl: any;
  parcelURL: any;

  @ViewChild('mapViewNode', {static: true}) private mapViewEl: ElementRef;

  constructor(private zone: NgZone, private serviceTable: ServiceTable, private searchComponent: SearchComponent) {}
  
  getMapLayer(name: string) {
    if (this.view) {
      return this.view.map.findLayerById(name);
    }
  }

  getMapView() {
    if (this.view) {
      return this.view;
    }
  }

  changeBoxState(item: any, values: any, state: boolean) {
    for (let value of values) {
      item[value].disable = state;
    }
  }

  initializeMap(): Promise<any> {
    //Sets logger parameters, adds timestamp and sets level
    Logger.useDefaults();
    Logger.setLevel(Logger.INFO);

    const container = this.mapViewEl.nativeElement;

    // ===============================     BASEMAP    ================================= //
    const tileLayer = new TileLayer({
      url: "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"
    });

    let typeBasemap;
    let currentLang: string = document.documentElement.lang;

    if (currentLang === 'en-CA') {
      typeBasemap = "topo-vector";
    }
    else if (currentLang === 'fr-CA') {
      let basemapFrench = new VectorTileLayer({
        url: "https://www.arcgis.com/sharing/rest/content/items/b079fb8620f945cca0019db1cf611b45/resources/styles/root.json?f=pjson"
      })
  
      const basemapFra = new Basemap({
        baseLayers: [tileLayer, basemapFrench],
        thumbnailUrl: "https://js.arcgis.com/4.21/esri/images/basemap/topo.jpg",
        title: "Topo Basemap French",
        id: "topo-vector-fr",
      });
      typeBasemap = basemapFra;
    }
    // ================================================================================ //
    const layersObject: any = {};
    
    for (let elem in layerToSet) {
      layersObject[elem] = new MapImageLayer({
        url: "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB_NC_NEW/" + layerToSet[elem].url,
        id: elem,
      });
    }

    const mapMain = new EsriMap({
      basemap: typeBasemap,
      layers: Object.values(layersObject),
    });

    const view = new MapView({
      container,
      map: mapMain,
      zoom: 3,
      center: [-100, 71],
      constraints: {
        minScale: 70000000,
        maxScale: 400,
        lods: TileInfo.create().lods
      }
    });

    this.view = view;
    this.serviceTable.setMapApi(view);
    this.searchComponent.setMapApi(view);

    for (let i in this.scaleLevel) {
      this.view.constraints.lods[i].scale = this.scaleLevel[i];
    }

    const basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "hybrid",
    });

    let layerToggle = () => {
      if (!this.isSatelliteActive) {
        legendLayerGroups["parcel"][4].value.splice(0, 1, 5);
        legendLayerGroups["parcel"][4].image = "./assets/images/legend-719.png";
        this.isSatelliteActive = true;
      }
      else {
        legendLayerGroups["parcel"][4].value.splice(0, 1, 4);
        legendLayerGroups["parcel"][4].image = "./assets/images/legend-50.png";
        this.isSatelliteActive = false;
      }
    }

    let setAllLayers = () => {
      let mapImage: any = view.map.findLayerById('parcel');

      if (mapImage.findSublayerById(4).visible) {
        mapImage.findSublayerById(4).visible = false;
        mapImage.findSublayerById(5).visible = true;
      }
      else if (mapImage.findSublayerById(5).visible) {
        mapImage.findSublayerById(5).visible = false;
        mapImage.findSublayerById(4).visible = true;
      }
      else {
        mapImage.findSublayerById(5).visible = false;
        mapImage.findSublayerById(4).visible = false;
      }
    }

    let toogleBasemapVisibility = () => {
      const baseCheckbox = <HTMLElement>document.getElementById('basemap-check') as any;
      const baseImage = <HTMLElement>document.getElementById('basemap-image') as any;
      baseImage.srcset = "./assets/images/legend-3-2.png";
      baseCheckbox.checked = true;
    }

    let toggleLayerDisable = () => {
      this.changeBoxState(legendLayerGroups["creena"], [1], true);
      this.changeBoxState(legendLayerGroups["oil"], [1], true);
      this.changeBoxState(legendLayerGroups["settlement"], [2, 3, 4, 5, 7], true);
      this.changeBoxState(legendLayerGroups["admin"], [0, 3, 4], true);
    }

    let toggleLayerActive = () => {
      this.changeBoxState(legendLayerGroups["creena"], [1], false);
      this.changeBoxState(legendLayerGroups["oil"], [1], false);
      this.changeBoxState(legendLayerGroups["settlement"], [2, 3, 4, 5, 7], false);
      this.changeBoxState(legendLayerGroups["admin"], [0, 3, 4], false);
    }

    basemapToggle.on("toggle", () => {
      toogleBasemapVisibility();
      layerToggle();
      setAllLayers();
    })

    // Print Widget //
    let print = new Print({
      view: view,
      printServiceUrl: "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
      templateOptions: {
        legendEnabled: false,
      },
    });

    // Print container //
    const printExpand = new Expand({
      expandIconClass: "esri-icon-printer \ue668",
      content: print,
      view: view,
      expanded: false,
      id:"printExpand",
      expandTooltip: widgetText.printExpand,
      collapseTooltip: widgetText.printCollapse
    });

    // Fullscreen Widget //
    const fullscreen = new Fullscreen({
      view: view,
    });
    view.ui.add(fullscreen, "top-left");

    // Home button Widget //
    const homeBtn = new Home({
      view: view,
    });
    view.ui.add(homeBtn, "top-left");

    // Coord conversion tool
    const coordTool = new CoordinateConversion ({
      view: view,
    });

    watchUtils.whenOnce(coordTool, "formats.length", () => {
      coordTool.formats = coordTool.formats.filter(f => {
        return f.name === "xy" || f.name === "utm" || f.name === "usng" || f.name === "mgrs" || f.name === "dms" || f.name === "ddm" || f.name === "dd";
      });
    });

    // Coord conversion container
    const coordToolExpand = new Expand({
      view,
      expandIconClass: "esri-widget--button esri-interactive esri-icon-blank-map-pin \ue61e",
      content: coordTool,
      expanded: false,
      id:"coordToolExpand",
      expandTooltip: widgetText.pointExpand,
      collapseTooltip: widgetText.pointCollapse
    });

    // Add div element to show coordates //
    const coordsWidget = <HTMLElement>document.getElementById('coordsWidget');
    view.ui.add(coordsWidget, "bottom-left");

    watchUtils.whenTrue (view, "stationary", function () {
      if (view.scale <= 9244000) {
        toggleLayerActive();
      }
      else {
        toggleLayerDisable();
      }
    });

    // Get the new extent of the view only when view is stationary.
    let extentArray: any = [];
    const prevExtent = <HTMLElement>document.getElementById('prevExtent');
    const nextExtent = <HTMLElement>document.getElementById('nextExtent');
    let prevClicked: boolean;
    let nextClicked: boolean;

    watchUtils.whenTrue(view, "stationary", function() {
      if (view.extent) {
        // Limit previous list to 5
        if (extentArray.length >= 5) {
          extentArray.shift();
        }

        // Add extent to list just if user move the map
        if (!prevClicked && !nextClicked) {
          extentArray = extentArray.slice(0, tail-cursor+1);
          cursor = 0;
          extentArray.push(view.extent.clone());
          tail = extentArray.length-1;
        }
      }

      if (prevClicked) {
        prevClicked = false;
      }
      if (nextClicked) {
        nextClicked = false;
      }
    });
  
    let tail: number;
    let cursor = 0;
    let events = ['click', 'keypress'];

    for (let e of events) {
      prevExtent.addEventListener(e, function() {
        if ((tail-cursor) >= 1 && extentArray.length > 1) {
          cursor++;
          view.extent = extentArray[tail-cursor];
          prevClicked = true;
        }
      });
      
      nextExtent.addEventListener(e, function() {
        if ((tail-cursor) >= 0 && (tail-cursor) < extentArray.length-1 && extentArray.length > 1) {
          cursor--;
          view.extent = extentArray[tail-cursor];
          nextClicked = true;
        }
      });
    }

    const extentToggle = <HTMLElement>document.getElementById('navToolbar');
    view.ui.add(extentToggle, "top-right");

    // Add Measurement Widget //
    const measurement = new Measurement({
      view: view,
    });

    function distMeasurement() {
      area.classList.remove("active");
      distance.classList.add("active");
      measurement.activeTool = "distance";
    }

    function areaMeasurement() {
      distance.classList.remove("active");
      area.classList.add("active");
      measurement.activeTool = "area";
    }

    function clearMeasurements() {
      distance.classList.remove("active");
      area.classList.remove("active");
      measurement.clear();
    }

    // Area HTML Button //
    const area = <HTMLElement>document.getElementById('area');
    area.addEventListener('click', () => {
      areaMeasurement();
    })

    // Distance HTML Button //
    const distance = <HTMLElement>document.getElementById('distance');
    distance.addEventListener('click', () => {
      distMeasurement();
    })

    // Clear HTML Button //
    const removeDist = <HTMLElement>document.getElementById('removeDist');
    removeDist.addEventListener('click', () => {
      clearMeasurements();
    })

    const toolbar = <HTMLElement>document.getElementById('toolbar');

    const toolbarExpand = new Expand({
      view,
      expandIconClass: "esri-widget--button esri-interactive esri-icon-measure-line",
      content: toolbar,
      expanded: false,
      id: "toolbarExpand",
      expandTooltip: widgetText.toolbarExpand,
      collapseTooltip: widgetText.toolbarCollapse
    });
    view.ui.add(toolbarExpand, "top-right");

    // Update lat, lon, zoom and scale //
    function showCoordinates(pt: any) {
      let utm = require('utm');
      let LattoUTM: any;

      if (pt.latitude < 84 && pt.latitude > -80) {
        LattoUTM = utm.fromLatLon(pt.latitude, pt.longitude);
        let strScale = view.scale.toString();
        let formatScale = parseFloat(strScale).toLocaleString('fr');
        let formatEasting = parseFloat(LattoUTM.easting.toFixed(0)).toLocaleString('fr');
        let formatNorthing = parseFloat(LattoUTM.northing.toFixed(0)).toLocaleString('fr');
        let coords = `Lat: ${pt.latitude.toFixed(3)}  Lon: ${pt.longitude.toFixed(3)} | ${widgetText.scale} 1: ${formatScale}
                      <br>UTM  E: ${formatEasting}  N: ${formatNorthing} , Zone:  ${LattoUTM.zoneNum}`;
        coordsWidget.innerHTML = coords;
      }
    }

    // Add event and show center coordinates after the view is finished moving e.g. zoom, pan //
    view.watch(["stationary"], function() {
      showCoordinates(view.center);
    });

    // Add event to show mouse coordinates on click and move //
    view.on(["pointer-down","pointer-move"], function(evt) {
      showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
    });

    const tabContent = <HTMLElement>document.getElementById('legendContainer');
    const legendButton = <HTMLElement>document.getElementById('legendButton');

    for (let e of events) {
      legendButton.addEventListener(e, function() {
        if (tabContent.hidden) {
          tabContent.hidden = false;
        }
        else {
          tabContent.hidden = true;
        }
      })
    }

    // Position of components //
    const helpButton = <HTMLElement>document.getElementById('helpButton');

    for (let e of events) {
      helpButton.addEventListener(e, function() {
        window.open(helpSiteElement.siteAdress);
      })
    }

    view.ui.add(legendButton, "top-left");
    view.ui.add(basemapToggle, "bottom-right");
    view.ui.add(printExpand, "top-left");
    view.ui.add(helpButton, "top-left");
    view.ui.add("search", 'top-left');
    view.ui.add("tableResults", document.createElement("DIV"));
    view.ui.add(coordToolExpand, "top-right");
    view.ui.add(measurement, "bottom-right");
    
    Logger.info("Basemap toggle widget added.");
    Logger.info("Search widget added.");
    Logger.info("Table widget added.");
    return view.when();
  }

  ngOnInit(): any {

    this.zone.runOutsideAngular(() => {
      // Initialize MapView and return an instance of MapView
      this.initializeMap().then((view) => {
        this.view = view;

        /*let irLayer = this.view.map.findLayerById('ir');
        irLayer.findSublayerById(1).visible = true;
        irLayer.findSublayerById(2).visible = true;*/

        let url = window.location.search;
        this.canUrl = url.split('?can=')[1] || 0;
        this.plnUrl = url.split('?pln=')[1] || 0;
        this.projUrl = url.split('?prj=')[1] || 0;
        this.parcelURL = url.split('?pin=')[1] || 0;

        let serviceUrl = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC"
        let zoom = new ZoomToElement(this.serviceTable);

        if (this.canUrl != 0) {
          let url = serviceUrl + "/WMB_Query_Support/MapServer/" + 0;
          let whereClause = "ADMINAREAID = '" + this.canUrl + "'";
          zoom.getResultURL(url, whereClause);
        }
        else if (this.plnUrl != 0) {
          let url = serviceUrl + "/WMB_Query_Support/MapServer/" + 5;
          this.plnUrl = decodeURIComponent(this.plnUrl);
          let whereClause = "PLANNO = '" + this.plnUrl + "'";
          zoom.getResultURL(url, whereClause);
        }
        else if (this.projUrl != 0) {
          let url = serviceUrl + "/WMB_Query_Support/MapServer/" + 4;
          let whereClause = "PROJECTNUMBER = '" + this.projUrl + "'";
          zoom.getResultURL(url, whereClause);
        }
        else if (this.parcelURL != 0) {
          let url = serviceUrl + "/WMB_Query_CA/MapServer/" + 1;
          let whereClause = "PIN = " + this.parcelURL;
          zoom.getResultURL(url, whereClause);
        }

        this.zone.run(() => {
          Logger.info('MapView ready');
        });

      });
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
  }
}
