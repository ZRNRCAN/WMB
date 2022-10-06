interface Province {
  value: string;
  viewValue: string
}

interface Translations {
  [lang: string]: {
    [title: string]: string,
  }
}

let textElement: Translations = {
  'common': {
    abTitle: 'Alberta',
    mbTitle: 'Manitoba',
    nuTitle: 'Nunavut',
    onTitle: 'Ontario',
    skTitle: 'Saskatchewan',
    ytTitle: 'Yukon',
  },
  'en-CA': {
    bcTitle: 'British Columbia',
    nbTitle: 'New Brunswick',
    nlTitle: 'Newfoundland and Labrador',
    ntTitle: 'Northwest Territories',
    nsTitle: 'Nova Scotia',
    peTitle: 'Prince Edward Island',
    qcTitle: 'Quebec',
  },
  'fr-CA': {
    bcTitle: 'Colombie-Britannique',
    nbTitle: 'Nouveau-Brunswick',
    nlTitle: 'Terre-Neuve-et-Labrador',
    ntTitle: 'Territoires du Nord-Ouest',
    nsTitle: 'Nouvelle-Écosse',
    peTitle: 'Île-du-Prince-Édouard',
    qcTitle: 'Québec',
  }
}

let currentLang: string = document.documentElement.lang;
let langTextElem = textElement[currentLang];

let prov: Province[] = [];

if (currentLang === 'en-CA') {
  prov = [
    {value: 'ab', viewValue: textElement['common']['abTitle']},
    {value: 'bc', viewValue: langTextElem['bcTitle']},
    {value: 'mb', viewValue: textElement['common']['mbTitle']},
    {value: 'nb', viewValue: langTextElem['nbTitle']},
    {value: 'nl', viewValue: langTextElem['nlTitle']},
    {value: 'nt', viewValue: langTextElem['ntTitle']},
    {value: 'ns', viewValue: langTextElem['nsTitle']},
    {value: 'nu', viewValue: textElement['common']['nuTitle']},
    {value: 'on', viewValue: textElement['common']['onTitle']},
    {value: 'pe', viewValue: langTextElem['peTitle']},
    {value: 'qc', viewValue: langTextElem['qcTitle']},
    {value: 'sk', viewValue: textElement['common']['skTitle']},
    {value: 'yt', viewValue: textElement['common']['ytTitle']},
  ];
}
else if (currentLang === 'fr-CA') { 
  prov = [
    {value: 'ab', viewValue:  textElement['common']['abTitle']},
    {value: 'bc', viewValue: langTextElem['bcTitle']},
    {value: 'pe', viewValue: langTextElem['peTitle']},
    {value: 'mb', viewValue:  textElement['common']['mbTitle']},
    {value: 'nb', viewValue: langTextElem['nbTitle']},
    {value: 'ns', viewValue: langTextElem['nsTitle']},
    {value: 'nu', viewValue:  textElement['common']['nuTitle']},
    {value: 'on', viewValue:  textElement['common']['onTitle']},
    {value: 'qc', viewValue: langTextElem['qcTitle']},
    {value: 'sk', viewValue:  textElement['common']['skTitle']},
    {value: 'nl', viewValue: langTextElem['nlTitle']},
    {value: 'nt', viewValue: langTextElem['ntTitle']},
    {value: 'yt', viewValue:  textElement['common']['ytTitle']},
  ];
}

export const provincesElem = prov;