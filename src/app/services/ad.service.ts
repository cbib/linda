import { Injectable }           from '@angular/core';
import { PubAdComponent }   from '../banners/pub-ad.component';
import { AdItem }               from '../banners/ad-item';

@Injectable()
export class AdService {
  getAds() {
    console.log()
    return [
//      new AdItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'}),
//
//      new AdItem(HeroProfileComponent, {name: 'Dr IQ', bio: 'Smart as they come'}),

//      new AdItem(PubAdComponent,   {headline: 'Hiring for several positions',
//                                        body: 'Submit your resume today!'}),

      new AdItem(PubAdComponent,   {headline: 'Bordeaux Bioinformatics Center',
                                        body: '<a href="https://cgfb.u-bordeaux.fr/"><img src="assets/images/cbib.jpg" ></a>'}),
                                        
//      new AdItem(PubAdComponent,   {headline: 'Opening in all departments',
//                                        body: 'Apply today'}),
    ];
  }
}