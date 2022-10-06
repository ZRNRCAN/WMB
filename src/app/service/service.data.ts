import { Injectable } from '@angular/core';

 interface ResultTable {
  name: string;
  province: string;
}

@Injectable({
  providedIn: 'root'
})

export class ServiceData {
  private ADMIN_DATA: ResultTable[] = [];
  private PROJECT_DATA: ResultTable[] = [];
  private PLAN_DATA: ResultTable[] = [];
  private TOWN_DATA: ResultTable[] = [];
  private PARCEL_DATA: ResultTable[] = [];

  constructor() {}

  getData(id: string): any {
    if (id === "divAdmin") {
      return this.getAdminData();
    }
    else if (id === "divProject") {
      return this.getProjectData();
    }
    else if (id === "divTownship") {
      return this.getTownData();
    }
    else if (id === "divParcel") {
      return this.getParcelData();
    }
    else if (id === "divPlan") {
      return this.getPlanData();
    }
  }

  getAdminData(): any {
    return this.ADMIN_DATA;
  }
  getProjectData(): any {
    return this.PROJECT_DATA;
  }
  getPlanData(): any {
    return this.PLAN_DATA;
  }
  getTownData(): any {
    return this.TOWN_DATA;
  }
  getParcelData(): any {
    return this.PARCEL_DATA;
  }

  addAdminPost(data: any) {
    this.ADMIN_DATA.push(data);
  }
  addProjectPost(data: any) {
    this.PROJECT_DATA.push(data);
  }
  addPlanPost(data: any) {
    this.PLAN_DATA.push(data);
  }
  addTownPost(data: any) {
    this.TOWN_DATA.push(data);
  }
  addParcelPost(data: any) {
    this.PARCEL_DATA.push(data);
  }

  countAdminFeatures(): number {
    return this.ADMIN_DATA.length;
  }

  removeData() {
    this.ADMIN_DATA = [];
    this.PROJECT_DATA = [];
    this.PLAN_DATA = [];
    this.TOWN_DATA = [];
    this.PARCEL_DATA = [];
  }
}