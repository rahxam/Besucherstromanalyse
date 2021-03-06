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

entity EntrancesCurrentStatus {
    key entrance : Association to one Entrances;
    key event : Association to one Events;
    status : String;
    color : String;
    waitingTime : Integer;
    waitingPeople : Integer;
}

entity EntrancesHistoryStatus {
    key entrance : Association to one Entrances;
    key event : Association to one Events;
    key date : DateTime;
    percentage : Double;
    waitingTime : Integer;
    waitingPeople : Integer;
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
