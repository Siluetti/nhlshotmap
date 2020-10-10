import { createStore } from "redux";
import selectDateReducer from "../reducers/selectDateReducer";

function configureStore(
    state = { 
        startDate: new Date(),
        endDate: new Date(), 
    }
) {
  return createStore(selectDateReducer, state);
}

export default configureStore;