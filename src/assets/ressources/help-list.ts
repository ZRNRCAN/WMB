let helpSite: any = {
  'en-CA': {
    siteAdress: "https://proxyinternet.nrcan.gc.ca/arcgis/rest/directories/arcgisoutput/Help_Aide/Help.html",
  },
  'fr-CA': {
    siteAdress: "https://proxyinternet.nrcan.gc.ca/arcgis/rest/directories/arcgisoutput/Help_Aide/Aide.html",
  }
};

let currentLang: string = document.documentElement.lang;
export const helpSiteElement: any = helpSite[currentLang];
