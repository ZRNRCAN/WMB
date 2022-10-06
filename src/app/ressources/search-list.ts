import { queryFields } from "./text-items"

interface searchElem {
  [id: number]: {
    url: string,
    fields: Array<string>,
    tab: string,
    filter: Array<string>,
    where?: string,
  }
}

let nameField = queryFields.nameField;
let parcelFcField = queryFields.parcelFcField;
let remainderField = queryFields.remainderField;

const urlMapService = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_CA/MapServer/";

export const searchOptions: searchElem = {
  0: {
    url: urlMapService + 2,
    fields: [nameField, "OBJECTID", "ADMINAREAID", "GlobalID", "PROVINCE", "SOURCEDB", "ENGLISHNAME"],
    tab: "divAdmin",
    filter: ["ab", "bc", "pe", "mb", "nb", "ns", "on", "qc", "sk", "nl"],
  },
  2: {
    url: urlMapService + 14,
    fields: [nameField, "OBJECTID", "ADMINAREAID", "GlobalID", "PROVINCE", "SOURCEDB", "ENGLISHNAME"],
    tab: "divAdmin",
    filter: ["ab", "bc", "mb", "nb", "nl", "nt", "ns", "nu", "on", "pe", "sk", "yt"],
  },
  3: {
    url: urlMapService + 3,
    fields: [nameField, "FIRSTNATION", "ADMINAREAID", "GlobalID", "PROVINCE", "SOURCEDB", "ENGLISHNAME"],
    tab: "divAdmin",
    filter: ["nu", "yt"],
  },
  4: {
    url: urlMapService + 4,
    fields: [nameField, "ADMINAREAID", "GlobalID", "PROVINCE", "SOURCEDB", "ENGLISHNAME"],
    tab: "divAdmin",
    filter: ["mb", "nb", "nl", "nt", "ns", "nu", "on", "pe", "qc", "sk", "yt"],
  },
  5: {
    url: urlMapService + 5,
    fields: [nameField, "ADMINAREAID", "GlobalID", "PROVINCE", "SOURCEDB", "ENGLISHNAME"],
    tab: "divAdmin",
    filter: [""],
  },
  6: {
    url: urlMapService + 1,
    fields: ["PARCELDESIGNATOR", "PLANNO", "FIRSTNATION", parcelFcField, "REMAINDERIND", remainderField, "GEOADMINCODE", "PIN", "GlobalID_PLA", "GlobalID", "PROVINCE"],
    where: "PARCELDESIGNATOR",
    tab: "divParcel",
    filter: [""],
  },
  7: {
    url: urlMapService + 7,
    fields: ["PARCELDESIGNATOR", "PLANNO", parcelFcField, "REMAINDERIND", remainderField, "PIN", "GlobalID_PLA", "GlobalID", "PROVINCE"],
    tab: "divParcel",
    filter: ["ab", "bc", "mb", "nl", "ns", "on", "pe", "qc", "sk"],
  },
  8: {
    url: urlMapService + 8,
    fields: [nameField, "ADMINAREAID", "GlobalID", "PROVINCE", "SOURCEDB", "ENGLISHNAME"],
    tab: "divAdmin",
    filter: ["ab", "bc", "mb", "nb", "nl", "ns", "on", "pe", "qc", "sk"],
  },
  9: {
    url: urlMapService + 0,
    fields: ["PLANNO", "P2_DESCRIPTION", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO", "GEOADMINCODE", "GlobalID", "PROVINCE"],
    tab: "divPlan",
    filter: [""],
  },
  10: {
    url: urlMapService + 9,
    fields: ["PROJECTNUMBER", "DESCRIPTION", "URL", "GEOADMINCODE", "OBJECTID", "GlobalID", "PROVINCE"],
    tab: "divProject",
    filter: [""],
  },
  11: {
    url: "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/NRCan_SGB_Business_LCC/MapServer/94",
    fields: ["TOWNSHIPSECTION", "TP", "RANGE", "DIRECTION", "MERIDIAN", "TOWNSHIP", "GlobalID", "PROVINCE"],
    tab: "divTownship",
    filter: ["bc", "nb", "nl", "nt", "ns", "nu", "on", "pe", "qc", "yt"],
  },
  12: {
    url:  urlMapService + 3,
    fields: [nameField, "FIRSTNATION", "ADMINAREAID", "GlobalID", "PROVINCE"],
    tab: "divAdmin",
    filter: [""],
  },
}
