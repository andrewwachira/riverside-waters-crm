import moment from "moment";

export function getDateDiff(date){
    const incomingDate = moment(date);
    const current = moment().startOf('day');
    var daysDiff = moment.duration(incomingDate.diff(current)).asDays();
    return daysDiff
  }