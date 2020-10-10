export default (state, action) => {
    switch (action.type) {
        case "selectStartDateAction":
            console.log("Got start date action with payload "+action.date);
            return {
                ...state,
                startDate: action.date
            };
        case "selectEndDateAction":
            console.log("Got end date action with payload "+action.date);
            return {
                ...state,
                endDate: action.date
            };
        default:
            return state;
    }
  };