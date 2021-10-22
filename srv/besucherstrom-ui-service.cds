using { odc.hackaton as my } from '../db/schema';
service BesucherstromUiService {
  entity Tickets as projection on my.Tickets {
    * , event.name as eventName, event.date as eventDate, block.entrance.ID as entrance_ID, block.entrance.name as entranceName
  };
  entity EntrancesCurrentStatus as projection on my.EntrancesCurrentStatus;
  entity EntrancesHistoryStatus as projection on my.EntrancesHistoryStatus {
    *,
    virtual event.name as color
  };
}
