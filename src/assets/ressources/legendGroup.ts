import { legendTextElem, legendViewElem } from "@ressources/index";

interface legendGroupInterface {
  value: any;
  viewValue: string;
  image: string;
  image2?: string;
  description: string;
  select: boolean;
  service: string;
  disable: boolean;
  NumSecondLayer?: any;
  NumThirdLayer?: any;
}
  
const itemsParcel: legendGroupInterface[] = [
  {value: [2], viewValue: legendViewElem.condo, image: "./assets/images/legend-729.png", description: legendTextElem.condo, select: true, service:"parcel", disable: false},
  {value: [3], viewValue: legendViewElem.strata, image: "./assets/images/legend-738.png", description: legendTextElem.strataParcel, select: true, service:"parcel", disable: false},
  {value: [0], viewValue: legendViewElem.inconclusive, image: "./assets/images/legend-742.png", description: legendTextElem.inconclusiveDescription, select: true, service:"parcel", disable: false},
  {value: [1], viewValue: legendViewElem.unresolved, image: "./assets/images/legend-743.png", description: legendTextElem.unresolved, select: true, service:"parcel", disable: false},
  {value: [4], viewValue: legendViewElem.landParcel, image: "./assets/images/legend-50.png", image2: "./assets/images/legend-738.png", description: legendTextElem.landParcel, select: true, service:"parcel", disable: false},
  {value: [6], viewValue: legendViewElem.landParcelOther, image: "./assets/images/legend-71.png", description: legendTextElem.landParcelOtherDescription, select: true, service:"parcel", disable: false},
];

const itemsYukonFirstNation: legendGroupInterface[] = [
  {value: [0], viewValue: legendViewElem.yukonParcel, image: "./assets/images/legend-727.png", description: legendTextElem.yukonFNParcel, select: true, service:"yfn", NumSecondLayer: [3], disable: false},
  {value: [1], viewValue: legendViewElem.yukonLot, image: "./assets/images/legend-715.png", description: legendTextElem.lotWithinSettlementDescription, select: true, service:"yfn", NumSecondLayer: [], disable: false},
];

const itemsCreeNaskapi: legendGroupInterface[] = [
  {value: [3], viewValue: legendViewElem.creenaRight, image: "./assets/images/legend-731.png", description: legendTextElem.creenaRight, select: true, service:"creena_1", NumSecondLayer: [], NumThirdLayer: [3], disable: false},
  {value: [4], viewValue: legendViewElem.creenaAdminLot, image: "./assets/images/legend-711.png", description: legendTextElem.creenaLot, select: true, service:"creena_1", NumSecondLayer: [1], NumThirdLayer: [4], disable: false},
  {value: [0], viewValue: legendViewElem.creenaOther, image: "./assets/images/legend-51.png", description: legendTextElem.creeLotOtherDescription, select: true, service:"creena_1", NumSecondLayer: [], NumThirdLayer: [0], disable: false},
  {value: [2], viewValue: legendViewElem.creenaBlock, image: "./assets/images/legend-732.png", description: legendTextElem.creenaBlock, select: true, service:"creena_1", NumSecondLayer: [], NumThirdLayer: [2], disable: false},
  {value: [1], viewValue: legendViewElem.creenaLot, image: "./assets/images/legend-733.png", description: legendTextElem.creeLotDescription, select: true, service:"creena_1", NumSecondLayer: [], NumThirdLayer: [1], disable: false},
];

const itemsOilAndGas:legendGroupInterface[] = [
  {value: [3], viewValue: legendViewElem.irOilGasParcel, image: "./assets/images/legend-734.png", description: legendTextElem.irOilGasParcel, select: true, service:"oil", NumSecondLayer: [], disable: false},
  {value: [0], viewValue: legendViewElem.grid, image: "./assets/images/legend-755.png", description: legendTextElem.nad83, select: true, service:"oil", NumSecondLayer: [11], disable: false},
  {value: [1], viewValue: legendViewElem.subOilUnit, image: "./assets/images/legend-58.png", description: legendTextElem.oilAndGasSurveyedSSGDescription, select: true, service:"oil", NumSecondLayer: [], disable: false},
  {value: [2], viewValue: legendViewElem.subOilParcel, image: "./assets/images/legend-59.png", description: legendTextElem.subGasParcelDescription, select: true, service:"oil", NumSecondLayer: [], disable: false},
];

const itemsSettlementLand: legendGroupInterface[] = [
  {value: [7], viewValue: legendViewElem.inuvialuitFinalInternal, image: "./assets/images/legend-712.png", description: legendTextElem.inuvialuitFinalInternal, select: true, service:"settlement", NumSecondLayer: [], disable: false},
  {value: [6], viewValue: legendViewElem.inuitOwnedInternalParcel, image: "./assets/images/legend-713.png", description: legendTextElem.inuitOwnedInternal, select: true, service:"settlement", NumSecondLayer: [], disable: false},
  {value: [5], viewValue: legendViewElem.gwichinParcel, image: "./assets/images/legend-721.png", description: legendTextElem.gwichinParcel, select: true, service:"settlement", NumSecondLayer: [8], disable: false},
  {value: [0], viewValue: legendViewElem.inuitOwnedParcel, image: "./assets/images/legend-722.png", description: legendTextElem.inuitOwnedParcel, select: true, service:"settlement", NumSecondLayer: [4], disable: false},
  {value: [1], viewValue: legendViewElem.inuvialuitFinalParcel, image: "./assets/images/legend-723.png", description: legendTextElem.inuvialuitFinalParcel, select: true, service:"settlement", NumSecondLayer: [5], disable: false},
  {value: [2], viewValue: legendViewElem.sahtuParcel, image: "./assets/images/legend-724.png", description: legendTextElem.sahtu, select: true, service:"settlement", NumSecondLayer: [6], disable: false},
  {value: [3], viewValue: legendViewElem.saltRiverParcel, image: "./assets/images/legend-725.png", description: legendTextElem.saltRiver, select: true, service:"settlement", NumSecondLayer: [], disable: false},
  {value: [4], viewValue: legendViewElem.tlichoParcel, image: "./assets/images/legend-726.png", description: legendTextElem.tlicho, select: true, service:"settlement", NumSecondLayer: [7], disable: false},
];

const itemsAdministrativeArea: legendGroupInterface[] = [
  {value: [0], viewValue: legendViewElem.ir, image: "./assets/images/legend-717.png", description: legendTextElem.indianReserveDescription, select: true, service:"ir",   NumSecondLayer: [2], disable: false},
  {value: [1], viewValue: legendViewElem.fnlmIr, image: "./assets/images/legend-717-1.png", description: legendTextElem.indianReserveFNLMDescription, select: true, service:"ir",   NumSecondLayer: [], disable: false},
  {value: [2], viewValue: legendViewElem.otherIr, image: "./assets/images/legend-717-2.png", description: legendTextElem.indianReserveDescription, select: true, service:"ir",   NumSecondLayer: [], disable: false},
  {value: [5], viewValue: legendViewElem.il, image: "./assets/images/legend-718.png", description: legendTextElem.indianLand, select: true, service:"admin",   NumSecondLayer: [], disable: false},
  {value: [2], viewValue: legendViewElem.townsite, image: "./assets/images/legend-750.png", description: legendTextElem.townsite, select: true, service:"admin",   NumSecondLayer: [], disable: false},
  {value: [3], viewValue: legendViewElem.nationalPark, image: "./assets/images/legend-751.png", description: legendTextElem.nationalPark, select: true, service:"admin",   NumSecondLayer: [9], disable: false},
  {value: [4], viewValue: legendViewElem.territorialPark, image: "./assets/images/legend-752.png", description: legendTextElem.territorialPark, select: true, service:"admin",   NumSecondLayer: [10], disable: false},
  {value: [6], viewValue: legendViewElem.community, image: "./assets/images/legend-741.png", description: legendTextElem.communityDescription, select: true, service:"admin",   NumSecondLayer: [], disable: false},
  {value: [0], viewValue: legendViewElem.ntsQuad, image: "./assets/images/legend-754.png", description: legendTextElem.ntsQuad, select: false, service:"grid",   NumSecondLayer: [], disable: false},
  {value: [1], viewValue: legendViewElem.group, image: "./assets/images/legend-92.png", description: legendTextElem.groupDescription, select: false, service:"grid",   NumSecondLayer: [], disable: false},
  {value: [8], viewValue: legendViewElem.subdivision, image: "./assets/images/legend-79.png", description: legendTextElem.subdivisionDescription, select: true, service:"admin",   NumSecondLayer: [], disable: false},
];

export const legendLayerGroups = {
  "parcel": itemsParcel,
  "yfn": itemsYukonFirstNation,
  "creena": itemsCreeNaskapi,
  "oil": itemsOilAndGas,
  "settlement": itemsSettlementLand,
  "admin": itemsAdministrativeArea,
}