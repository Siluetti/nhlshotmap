import { createStore } from "redux";
import selectDateReducer from "../reducers/selectDateReducer";

function configureStore() {
  var startDate = new Date();
  startDate.setDate(startDate.getDate()-10);
  var endDate = new Date();
  
  var state = {
    startDate: startDate,
    endDate: endDate, 
  }
  
  return createStore(selectDateReducer, state);
}

export default configureStore;