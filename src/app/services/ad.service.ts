import { Injectable }           from '@angular/core';
import { PubAdComponent }   from '../banners/pub-ad.component';
import { AdItem }               from '../banners/ad-item';
import { Location } from "@angular/common";

@Injectable()
export class AdService {
  getAds() {
    
    //console.log(window.location.href )
    var image_path_cbib=window.location.href+'assets/images/cbib.jpg'
    var image_path_inra='assets/images/inra.jpg'
    return [
//      new AdItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'}),
//
//      new AdItem(HeroProfileComponent, {name: 'Dr IQ', bio: 'Smart as they come'}),

//      new AdItem(PubAdComponent,   {headline: 'Hiring for several positions',
//                                        body: 'Submit your resume today!'}),

      new AdItem(PubAdComponent,   {headline: 'Bordeaux Bioinformatics Center',
                                        //body: '<a href="https://cgfb.u-bordeaux.fr/"><img src="assets/images/cbib.jpg"></a>'}),
                                        body: image_path_cbib}),
                                        
      new AdItem(PubAdComponent,   {headline: 'INRA',
                                        //body: '<a href="https://cgfb.u-bordeaux.fr/"><img src="assets/images/cbib.jpg"></a>'}),
                                        body: image_path_inra}),
                                        //body: image_path}),
                                        
//      new AdItem(PubAdComponent,   {headline: 'Opening in all departments',x
//                                        body: 'Apply today'}),
    ];
  }
}
