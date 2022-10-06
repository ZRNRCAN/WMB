import Extent from "@arcgis/core/geometry/Extent";
import Graphic from "@arcgis/core/Graphic"
import Query from "@arcgis/core/rest/support/Query";
import * as RestQuery from "@arcgis/core/rest/query";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import {ServiceTable} from "@ressources/index";

export interface ZoomToElement {
  eventType: string;
  globalId: string;
  province: string;
}

let symbol = {
  type: "simple-fill",
  color: [125,125,125,0.35],
  style: "solid",
  outline: {
    color: [51,255,255],
    width: 1,
  }
};

export class ZoomToElement {
  private baseURL: string = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
  private mapApi: any;

  private ext = new Extent();
  private query: Query = new Query();
  private queryTask = RestQuery;

  private mapSpatialRef: SpatialReference = new SpatialReference({"wkid" : 102100});  //wkid of ESRI basemap
  private curhighfeature: any;

  private keepGraphics: boolean = false;
 
  constructor(private serviceTable: ServiceTable) {
    this.curhighfeature = new Graphic({symbol: symbol});
    this.mapApi = this.serviceTable.mapapi;
    this.query.returnGeometry = true;
    this.query.outFields = ["GlobalID"];
    this.query.outSpatialReference = this.mapSpatialRef;
    this.ext.spatialReference = this.mapSpatialRef;
  }

  setColor(outline: any, interior: any) {
    symbol.color = interior;
    symbol.outline.color = outline;
  }

  getResultURL(url: string, where: string) {
    this.query.outFields = ["GlobalID", "PROVINCE"];
    this.query.where = where;
    this.queryTask.executeQueryJSON(url, this.query).then((results) => {
      let resultsLength = results.features.length;

      if (resultsLength > 0) {
        this.getResult(results.features[0].attributes.PROVINCE, results.features[0].attributes.GlobalID, "click")
      }
    })
  }

  getResult(province: string, globalId: string, eventType: string) {
    let url = this.baseURL + "WMB_Highlight_" + province.substring(0,2) + "/MapServer/0";
    this.query.where = "GlobalID = '" + globalId + "'";

    if (eventType === 'click') {
      this.queryTask.executeQueryJSON(url, this.query).then((results) => {
        let resultsLength = results.features.length;

        if (resultsLength > 0) {
          this.zoomFeature(results);
        }
      })
    }
    else if (eventType == 'mouseover') {
      this.curhighfeature = new Graphic({symbol: symbol});

      this.queryTask.executeQueryJSON(url, this.query).then((results) => {
        this.highlightFeature(results);
      })
    }
  }
  
  zoomFeature(featureSet: __esri.FeatureSet) {
    let curfeature = featureSet.features[0];
    let curfeaturegeom = curfeature.geometry;
    let curfeatureType = curfeaturegeom.type;

    if (curfeatureType == "polygon" || curfeatureType == "extent") {
      this.ext.xmin = curfeaturegeom.extent.xmin;
      this.ext.ymin = curfeaturegeom.extent.ymin;
      this.ext.xmax = curfeaturegeom.extent.xmax;
      this.ext.ymax = curfeaturegeom.extent.ymax;
      this.mapApi.extent = this.ext;
      this.mapApi.scale*= 2;
    }
  }

  highlightFeature(featureSet: __esri.FeatureSet) {
    let curfeaturegeom = featureSet.features[0].geometry;
    this.curhighfeature.geometry = curfeaturegeom;
    this.curhighfeature.attributes = featureSet.features[0].attributes.GlobalID;
    this.mapApi.graphics.add(this.curhighfeature);
  }

  get keepGraph(): boolean {
    return this.keepGraphics;
  }

  set keepGraph(keepGraphics: boolean) {
    this.keepGraphics = keepGraphics;
  }
 
  resetGraphGlobal() {
    this.mapApi.graphics.items = [];
  }

  removeFeature(globalid: string) {
    let graphicItems = this.mapApi.graphics.items;

    for (let item of graphicItems) {
      if (item.attributes === globalid) {
       this.mapApi.graphics.remove(item);
      }
    }
  }
}
