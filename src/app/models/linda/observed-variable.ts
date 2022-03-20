export interface ObservedVariableInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Variable ID':string;
    'Variable name':string;
    'Variable accession number': string;
    'Scale':string;
    'Scale accession number':string;
    'Time scale': string;
    'Trait':string;
    'Trait accession number':string;
    'Method':string;
    'Method description':string;
    'Method accession number':string;
    'Reference associated to the method':string;   
}
export class ObservedVariable implements ObservedVariableInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Definition': string;
    'Variable ID':string;
    'Variable name':string;
    'Variable accession number': string;
    'Scale':string;
    'Scale accession number':string;
    'Time scale': string;
    'Trait':string;
    'Trait accession number':string;
    'Method':string;
    'Method description':string;
    'Method accession number':string;
    'Reference associated to the method':string;
    constructor(){
        this["Variable ID"]=""
        this["Variable name"]=""
        this["Variable accession number"]=""
        this["Scale"]=""
        this["Scale accession number"]=""
        this["Time scale"]=""
        this["Trait"]=""
        this["Trait accession number"]=""
        this["Method"]=""
        this["Method description"]=""
        this["Method accession number"]=""
        this["Reference associated to the method"]=""
    }
}
