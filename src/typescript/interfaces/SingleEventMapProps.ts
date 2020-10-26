export default interface SingleEventMapProps { 
    hidden: boolean,
    startDate: Date,
    endDate: Date,
    selectStartDateAction: (date:Date) => void,
    selectEndDateAction: (date:Date) => void,
};
