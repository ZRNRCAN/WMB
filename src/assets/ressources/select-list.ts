export interface Option {
  value: number;
  viewValue: string
}

interface Translations {
  [lang: string]: {
    adminTitle: string,
    communityTitle: string,
    creeTitle: string,
    reserveTitle: string,
    boundaryTitle: string,
    parkTitle: string,
    parcelTitle: string,
    protectedTitle: string,
    quadTitle: string,
    planTitle: string,
    projectTitle: string,
    townTitle: string,
  }
}

let textElement: Translations = {
  'en-CA': {
    adminTitle: 'Administrative Area',
    communityTitle: 'Community',
    creeTitle: 'Cree-Naskapi',
    reserveTitle: 'Indian Reserve',
    boundaryTitle: 'Municipal Boundary (Parks)',
    parkTitle: 'National Park',
    parcelTitle: 'Parcel',
    protectedTitle: 'Protected Area',
    quadTitle: 'Quad',
    planTitle: 'Survey Plan',
    projectTitle: 'Survey in Progress',
    townTitle: 'Township',
  },
  'fr-CA': {
    adminTitle: 'Région administrative',
    communityTitle: 'Communauté',
    creeTitle: 'Cri-Naskapi',
    reserveTitle: 'Réserve indienne',
    boundaryTitle: 'Limite municipale (Parc)',
    parkTitle: 'Parc national',
    parcelTitle: 'Parcelle',
    protectedTitle: 'Aire protégée',
    quadTitle: 'Quadrilatère',
    planTitle: "Plan d'arpentage",
    projectTitle: 'Arpentage en cours',
    townTitle: 'Canton',
  }
}

let menuElement: any = {
  'en-CA': {
    parcelMenu: 'Parcel',
    projectMenu: 'Survey in Progress',
    planMenu: 'Survey Plan',
    townshipMenu: 'Township',
    adminMenu: 'Administrative Area',
  },
  'fr-CA': {
    parcelMenu: 'Parcelle',
    projectMenu: 'Arpentage en cours',
    planMenu: "Plan d'arpentage",
    townshipMenu: 'Canton',
    adminMenu: 'Région administrative',
  }
}

let currentLang:string = document.documentElement.lang;
let langTextElem = textElement[currentLang];
let menuTextElem = menuElement[currentLang];

let optionsElemSelect!: Option[];
let adminElemSelect!: Option[];

if (currentLang === 'en-CA') {
  optionsElemSelect = [
    {value: 12, viewValue: langTextElem.adminTitle},
    {value: 6, viewValue: langTextElem.parcelTitle},
    {value: 8, viewValue: langTextElem.quadTitle},
    {value: 9, viewValue: langTextElem.planTitle},
    {value: 10, viewValue: langTextElem.projectTitle},
    {value: 11, viewValue: langTextElem.townTitle},
  ];

  adminElemSelect = [
    {value: 0, viewValue: langTextElem.communityTitle},
    {value: 2, viewValue: langTextElem.creeTitle},
    {value: 3, viewValue: langTextElem.reserveTitle},
    {value: 4, viewValue: langTextElem.boundaryTitle},
    {value: 5, viewValue: langTextElem.parkTitle},
    {value: 7, viewValue: langTextElem.protectedTitle},
  ]
}
else if (currentLang === 'fr-CA') {
  optionsElemSelect = [
    {value: 10, viewValue: langTextElem.projectTitle},
    {value: 11, viewValue: langTextElem.townTitle},
    {value: 6, viewValue: langTextElem.parcelTitle},
    {value: 9, viewValue: langTextElem.planTitle},
    {value: 8, viewValue: langTextElem.quadTitle},
    {value: 12, viewValue: langTextElem.adminTitle},
  ];
  adminElemSelect = [
    {value: 7, viewValue: langTextElem.protectedTitle},
    {value: 0, viewValue: langTextElem.communityTitle},
    {value: 2, viewValue: langTextElem.creeTitle},
    {value: 4, viewValue: langTextElem.boundaryTitle},
    {value: 5, viewValue: langTextElem.parkTitle},
    {value: 3, viewValue: langTextElem.reserveTitle},
  ]
}

export const adminListItems: Option[] = adminElemSelect;

export const optionsElem: Option[] = optionsElemSelect;

export const menuListItems = [
  {tableId: 'divParcel', menuLinkText: menuTextElem.parcelMenu, value: 'parcel', menuIcon: 'crop_square', isDisabled: true, total:0},
  {tableId: 'divProject', menuLinkText: menuTextElem.projectMenu, value: 'project', menuIcon: 'edit', isDisabled: true, total:0},
  {tableId: 'divPlan', menuLinkText: menuTextElem.planMenu, value: 'plan', menuIcon: 'crop_original', isDisabled: true, total:0},
  {tableId: 'divTownship', menuLinkText: menuTextElem.townshipMenu, value: 'township', menuIcon: 'crop', isDisabled: true, total:0},
  {tableId: 'divAdmin', menuLinkText: menuTextElem.adminMenu, value:'admin', menuIcon: 'location_city', isDisabled: true, total:0},
];
