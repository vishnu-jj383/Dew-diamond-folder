import { configureStore } from "@reduxjs/toolkit";
import sideReducer from "../reducers/sideBarReducer"
import pdReducer from "../reducers/pdListReducer"
const store = configureStore({
    reducer: {
        sidebar: sideReducer,
        pdLists: pdReducer
    }
})

export default store