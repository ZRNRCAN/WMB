//import Query from "@arcgis/core/rest/support/Query";
//import * as RestQuery from "@arcgis/core/rest/query";
import { HttpClient } from '@angular/common/http';

export class QueryProxy {
  //private query: Query = new Query();
  public data: any;

  constructor(private httpClient: HttpClient) { }

  set queryURL(url: string) {
    this.queryURL = url;
  }

  async getResults(url: string, attributes: string[]): Promise<any> {
    this.data = [];

    await this.httpClient.get(url)
      .toPromise()
      .then((results: any) => 
        results.features.forEach((data: any) => {
          this.data.push(({viewValue: data.attributes[attributes[0]], value: data.attributes[attributes[1]]}))
        })
      )
    return Promise.resolve({
      data: this.data,
    });
  }

  /*async getResultsRest(where: string): Promise<any> {
    this.data = [];
    this.query.returnGeometry = false;

    this.query.outFields = ["ENGLISHNAME", "ADMINAREAID"];
    this.query.where = where;
    const data = await RestQuery.executeQueryJSON(this.queryURL, this.query);

    data.features.forEach(response => {
      this.data.push({value: response.attributes.ENGLISHNAME, viewValue: response.attributes.ADMINAREAID});
    })

    return Promise.resolve({
      data: this.data,
    });
  }*/
}
