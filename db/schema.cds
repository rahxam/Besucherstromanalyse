namespace odc.hackaton;


entity Tickets {
    key ID : String;
    block : Association to one Blocks;
    event : Association to one Events;
    perfectTime : DateTime;
}

entity Blocks {
    key ID : String;
    entrance : Association to one Entrances;
}

entity Entrances {
    key ID : String;
    name : String;
}

entity Events {
    key ID : String;
    name : String;
    date : DateTime;
}
