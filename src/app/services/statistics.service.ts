import { Injectable } from '@angular/core';
import { Subject, throwError, Observable  } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map} from 'rxjs/operators';
import {Constants} from "../constants";
import { VariableAst } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
// The idea of this class is to explore data from datafiles 
// acccording to MIAPE compliance; We can imagine some basic ffunctions

// Get all studiess with a ggiven observed Variable
// Get all observztions of a givzn  variable between different fatcor values and genotype species


export class StatisticsService {

  private APIUrl: string;
    //private FAIRDOM='https://fairdomhub.org/investigations/56';

    constructor(private http: HttpClient) {
        this.APIUrl = Constants.APIConfig.APIUrl;
    };

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }
    // get all studies for this investigation with a given observed variable 
    get_observed_variable(model_type: string): Observable<any> {
      return this.http.get(this.APIUrl + "get_model/" + model_type).pipe(map(this.extractData));
      // 1. Get all observed variables id
      // 2. Then get all data files of interest with these observed variable ids
      // 3. Imagine 
      // 3.1 We have defined an variable Plant height for 20 studies across europa. 
      // 3.2 We have 10 observations contained in observations units node in total (1 by genotype and condition, 5 genotypes, 2 conditions)
      // box plot obbserved variable (plant height) by studies and split (hue as seaborn) them between factor value
      // we can imagine to plot alll observed variables in a unique plo 
    }

    // Maybe imagine  to post and save figures 
    saveFigure(figname:string){
      console.log("start saving figures;..")
      
      let user=JSON.parse(localStorage.getItem('currentUser'));
      let obj2send={
          'username': user.username,
          'password': user.password,
          'figname':figname            
      };
      return this.http.post(`${this.APIUrl+"saveFigure"}`, obj2send).pipe(map(this.extractData));

    }
}
