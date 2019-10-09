export class Investigation {

    Definition:string;

};


export class InvestigationFull{
    _key:string;
    Definition:string;
    Investigation_unique_ID:{
        Definition:string;
        Example:string;
        Format:string;
    };
    Investigation_title:{
        Definition:string;
        Example:string;
        Format:string;
    };
    Investigation_description:{
        Definition:string;
        Example:string;
        Format:string;
    };
    Submission_date:{
        Definition:string;
        Example:string;
        Format:string;
    };
    Public_release_date:{
        Definition:string;
        Example:string;
        Format:string;
    };
    License:{
        Definition:string;
        Example:string;
        Format:string;
    };
    MIAPPE_version:{
        Definition:string;
        Example:string;
        Format:string;
    };
    Associated_publication:{
        Definition:string;
        Example:string;
        Format:string;
    };  
};

export class InvestigationFull2{
    _key:string;
    Definition:string;
    Investigation_unique_ID:Trio[];
    Investigation_title:Trio[];
    Investigation_description:Trio[];
    Submission_date:Trio[];
    Public_release_date:Trio[];
    License:Trio[];
    MIAPPE_version:Trio[];
    Associated_publication:Trio[];  
};


export class Trio{
    Definition:string;
    Example:string;
    Format:string;
}
