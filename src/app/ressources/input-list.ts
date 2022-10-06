interface Input {
  [index:number]: {
    viewValue: string;
    title: string;
  }
}

interface Translations {
  [lang: string]: {
    name: string,
    section: string,
    parcelDesig: string,
    ntsSheet: string,
    plan: string,
    projectNum: string,
    titleCommunity: string,
    titleSection: string,
    titleCree: string,
    titleReserve: string,
    titleMunicipal: string,
    titlePark: string,
    titleQuad: string,
    titlePlan: string,
    titleProject: string,
  }
}

let textElement: Translations = {
  'en-CA': {
    name: 'Name',
    section: 'Section',
    parcelDesig: 'Parcel Designator',
    ntsSheet: 'NTS Map Sheet',
    plan: 'Plan Number',
    projectNum: 'Project Number',
    titleCommunity: 'The name can be either a partial or full name, e.g. White or Whitehorse',
    titleSection: 'Section Name',
    titleCree: 'The name can be either a partial or full name, e.g. Chis or Chisasibi',
    titleReserve: 'The name can be either a partial or full name, e.g. Alex or Alexander 134',
    titleMunicipal: 'The name can be either a partial or full name, e.g. Jasp or Jasper',
    titlePark: 'The name can be either a partial or full name, e.g. Vun or Vuntut National Park',
    titleQuad: 'The NTS map sheet to use for a search criteria, e.g. 115A02',
    titlePlan: 'The plan number can be either a partial or full plan number, e.g. 67147 or 67147 CLSR AB',
    titleProject: 'The project number to use for a search criteria, e.g. 201210087.',
  },
  'fr-CA': {
    name: 'Nom',
    section: 'Section',
    parcelDesig: 'Désignation de parcelle',
    ntsSheet: 'Feuillet SNRC',
    plan: 'Numéro de Plan',
    projectNum: 'Numéro de projet',
    titleCommunity: 'Le nom partiel ou complet de la communauté, exemple: White ou Whitehorse',
    titleSection: 'Nom de section',
    titleCree: 'Le nom partiel ou complet, exemple: Chis ou Chisasibi',
    titleReserve: 'Le nom partiel ou complet de la réserve indienne, exemple: Akwe ou Akwesasne 15',
    titleMunicipal: 'Le nom partiel ou compet de la limite municipale, exemple: Jasp ou Jasper',
    titlePark: 'Le nom du partiel ou complet du parc national, exemple: Forillon ou Parc National du Canada Forillon',
    titleQuad: 'Le feuillet SNRC partiel ou complet, exemple: 105A02',
    titlePlan: 'Le numéro du plan partiel ou complet, exemple: 73743 ou 73743 CLSR QC',
    titleProject: 'Le numéro de projet partiel ou complet, exemple: 201304025 ou 2013',
  }
}

let currentLang:string = document.documentElement.lang;
let langTextElem = textElement[currentLang];

export const inputsElem: Input = {
  0: {viewValue: langTextElem.name, title: langTextElem.titleCommunity},
  1: {viewValue: langTextElem.section, title: langTextElem.titleSection},
  2: {viewValue: langTextElem.name,  title: langTextElem.titleCree},
  3: {viewValue: langTextElem.name, title: langTextElem.titleReserve},
  4: {viewValue: langTextElem.name, title: langTextElem.titleMunicipal},
  5: {viewValue: langTextElem.name, title: langTextElem.titlePark},
  6: {viewValue: langTextElem.parcelDesig, title: langTextElem.parcelDesig},
  7: {viewValue: langTextElem.parcelDesig, title: langTextElem.parcelDesig},
  8: {viewValue: langTextElem.ntsSheet, title: langTextElem.ntsSheet},
  9: {viewValue: langTextElem.plan, title: langTextElem.titlePlan},
  10: {viewValue: langTextElem.projectNum, title: langTextElem.titleProject},
  11: {viewValue: langTextElem.section, title: langTextElem.titleSection},
  12: {viewValue: langTextElem.name, title: langTextElem.name},
}
