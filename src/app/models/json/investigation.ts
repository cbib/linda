export interface Commons {
  "Definition": string;
  "Level": string;
  "Example": string;
  "Format": string;
  "Position": string;
  "Mapping": {
    "ISA-Tab File": string;
    "ISA-Tab Section (for Investigation file)": string;
    "ISA-Tab Field": string;
    "BrAPI Call": string;
    "BrAPI Object(s)": string;
    "BrAPI Field(s)": string;
  }
}
export interface Investigation {
    "_key": string;
    "_id": string;
    "_rev": string;
    "Definition": string;
    "Associated publication":Commons;
    "Short title": Commons;
    "Investigation unique ID": Commons;
    "License": Commons;
    "Submission date": Commons;
    "Investigation description": Commons;
    "Investigation title": Commons;
    "Public release date": Commons;
  }