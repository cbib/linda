/** Flat node with expandable and level information */
export interface OntologyFlatNode {
    expandable: boolean;
    name: string;
    namespace: string;
    level: number;
}