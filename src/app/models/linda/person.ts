
export interface PersonInterface {
    'Person role': string;
    'Person email':string;
    'Person name':string;
    'Person affiliation':string;
    'Person ID':string; 
}

export interface UserInterface {
    '_id':string;
    '_key':string;
    '_rev':string;
    'Person role': string;
    'Person email':string;
    'Person name':string;
    'Person affiliation':string;
    'Person ID':string;
    'username':string;
    'password': string;
    'admin':boolean;
    'dateCreated': Date;
    'tutoriel_step':string;
    'tutoriel_done': boolean;
    'token': string;   
}