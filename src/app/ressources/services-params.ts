
interface layerType {
  [index: string]: {
    url: string;
  }
}

export const layerToSet: layerType = {
  "initExtent": {
    url: "WMB_Full_Extent/MapServer",
  },
  "creena_1": {
    url: "WMB_Cree_Naskapi/MapServer",
  },
  "ancillary": {
    url: "WMB_Ancillary_Line/MapServer",
  },
  "easement": {
    url: "WMB_Easement/MapServer",
  },
  "grid": {
    url: "WMB_Grid/MapServer",
  },
  "claim": {
    url: "WMB_Mineral_Claim/MapServer",
  },
  "oil": {
    url: "WMB_Oil_and_Gas/MapServer",
  },
  "settlement": {
    url: "WMB_Settlement_Land/MapServer",
  },
  "sip": {
    url: "WMB_Survey_in_progress/MapServer",
  },
  "yfn": {
    url: "WMB_Yukon_First_Nation/MapServer",
  },
  "parcel": {
    url: "WMB_Parcel/MapServer",
  },
  "admin": {
    url: "WMB_Administrative/MapServer",
  },
  "ir": {
    url: "WMB_Indian_Reserve/MapServer",
  },
  "anno": {
    url: "Annotations/MapServer",
  },
}
