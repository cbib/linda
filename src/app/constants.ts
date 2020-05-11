export class Constants
{
    static APIConfig = class
    {
        static APIUrl:string = 'http://127.0.0.1:8529/_db/MIAPPE_GRAPH/xeml/';
        static get_api(){
            return this.APIUrl;
        }
    };

}