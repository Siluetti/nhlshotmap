export const selectStartDateAction = (date) => {
    return {
      type: "selectStartDateAction",
      date
    }
  };

export const selectEndDateAction = (date) => {
  return {
      type: "selectEndDateAction",
      date
    }
  };
  