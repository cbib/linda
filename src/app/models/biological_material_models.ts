export interface BiologicalMaterialTableModel {
    'Biological material ID' : string;
    'Biological material preprocessing': string
    'Material source DOI':string;
    'Material source ID (Holding institute/stock centre, accession)': string;
    'Infraspecific name':string;
    'Genus': string;
    'Species': string;
    'Organism':string
  }

  export interface BiologicalMaterialDialogModel {
    biologicalMaterialId: string;
    materialId: string;
    genus: string;
    species: string;
    lindaID:string;
    bmUUID:string;
    obsUUID:string;
  }