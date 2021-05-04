export interface Investigation {

    Definition:string;

};

export interface InvestigationForm 
{
    'Definition': "Investigations are research programmes with defined aims. They can exist at various scales (for example, they could encompass a grant-funded programme of work, the various components comprising a peer-reviewed publication, or a single experiment).",
    "Associated publication": {
      "Definition": "An identifier for a literature publication where the investigation is described. Use of DOIs is recommended.",
      "Level": "1",
      "Example": "doi:10.1371/journal.pone.0071377",
      "Format": "DOI",
      "Position": "7",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION PUBLICATIONS",
        "ISA-Tab Field": "Investigation Publication DOI",
        "BrAPI Call": "/trials/{trialDbId}",
        "BrAPI Object(s)": "publications",
        "BrAPI Field(s)": "publicationPUI"
      }
    },
    "Short title": {
      "Example": "FRIM01",
      "Level": "1",
      "Format": "Free text (short)",
      "Definition": "Short name for investigation",
      "Position": "2",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION",
        "ISA-Tab Field": "Comment[Short name]",
        "BrAPI Call": "None",
        "BrAPI Object(s)": "None",
        "BrAPI Field(s)": "None"
      }
    },
    "Investigation unique ID": {
      "Definition": "Identifier comprising the unique name of the institution/database hosting the submission of the investigation data, and the accession number of the investigation in that institution.",
      "Level": "1",
      "Example": "EBI:12345678",
      "Format": "Unique identifier",
      "Position": "1",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION",
        "ISA-Tab Field": "Investigation Identifier",
        "BrAPI Call": "/trials/{trialDbId}",
        "BrAPI Object(s)": "None",
        "BrAPI Field(s)": "trialDbId"
      }
    },
    "License": {
      "Definition": "License for the reuse of the data associated with this investigation. The Creative Commons licenses cover most use cases and are recommended.",
      "Level": "1",
      "Example": "CC BY-SA 4.0, Unreported",
      "Format": "Unique identifier",
      "Position": "8",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION",
        "ISA-Tab Field": "Comment[License]",
        "BrAPI Call": "/trials/{trialDbId}",
        "BrAPI Object(s)": "datasetAuthorships",
        "BrAPI Field(s)": "license"
      }
    },
    "Submission date": {
      "Definition": "Date of submission of the dataset presently being described to a host repository.",
      "Level": "1",
      "Example": "2012-12-17",
      "Format": "Date/Time (ISO 8601, optional time zone)",
      "Position": "5",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION",
        "ISA-Tab Field": "Investigation Submission Date",
        "BrAPI Call": "/trials/{trialDbId}",
        "BrAPI Object(s)": "datasetAuthorships",
        "BrAPI Field(s)": "submissionDate"
      }
    },
    "Investigation description": {
      "Definition": "Human-readable text describing the investigation in more detail.",
      "Level": "1",
      "Example": "The migration of maize from tropical to temperate climates was accompanied by a dramatic evolution in flowering time. To gain insight into the genetic architecture of this adaptive trait, we conducted a 50K SNP-based genome-wide association and diversity investigation on a panel of tropical and temperate American and European representatives.",
      "Format": "Free text",
      "position": "4",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION",
        "ISA-Tab Field": "Investigation Description",
        "BrAPI Call": "/trials/{trialDbId}",
        "BrAPI Object(s)": "None",
        "BrAPI Field(s)": "trialDescription"
      }
    },
    "Investigation title": {
      "Definition": "Human-readable string summarising the investigation.",
      "Level": "1",
      "Example": "Adaptation of Maize to Temperate Climates: Mid-Density Genome-Wide Association Genetics and Diversity Patterns Reveal Key Genomic Regions, with a Major Contribution of the Vgt2 (ZCN8) Locus.",
      "Format": "Free text (short)",
      "Position": "3",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION",
        "ISA-Tab Field": "Investigation Title",
        "BrAPI Call": "/trials/{trialDbId}",
        "BrAPI Object(s)": "None",
        "BrAPI Field(s)": "trialName"
      }
    },
    "Public release date": {
      "Definition": "Date of first public release of the dataset presently being described.",
      "Level": "1",
      "Example": "2013-02-25",
      "Format": "Date/Time (ISO 8601, optional time zone)",
      "Position": "6",
      "Mapping": {
        "ISA-Tab File": "Investigation",
        "ISA-Tab Section (for Investigation file)": "INVESTIGATION",
        "ISA-Tab Field": "Investigation Public Release Date",
        "BrAPI Call": "/trials/{trialDbId}",
        "BrAPI Object(s)": "datasetAuthorships",
        "BrAPI Field(s)": "publicReleaseDate"
      }
    }
  }


export interface InvestigationFull{
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

export interface InvestigationFull2{
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


export interface Trio{
    Definition:string;
    Example:string;
    Format:string;
}
