export class Constants
{
    static APIConfig = class
    {
        static APIUrl:string = 'https://services.cbib.u-bordeaux.fr/lindaAPI/_db/MIAPPE_GRAPH/xeml/';
	static get_api(){
            return this.APIUrl;
        }
    };

}
