import {
  FETCH_SAVINGS,
  FETCH_SAVINGS_DONE,
  FETCH_SAVINGS_FAILED,
  SET_FIELD,
  FETCH_LATEST_EXCHANGE_RATES_SUCCESS,
  SET_CURRENCY
} from "./actions";

const INITIAL_STATE = {
  isFetching: false,
  savings: [],
  initialSavings: 0,
  monthlySavings: 0,
  interestRate: 4,
  interestCalculationType: "Annually",
  currencyValue: "GBP",
  currencyOptions: []
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_FIELD: {
      const {
        initialSavings,
        monthlySavings,
        interestRate,
        interestCalculationType
      } = action.payload.value;
      return {
        ...state,
        initialSavings: +initialSavings || state.initialSavings,
        monthlySavings: +monthlySavings || state.monthlySavings,
        interestRate: +interestRate || state.interestRate,
        interestCalculationType: interestCalculationType ||
          state.interestCalculationType
      };
    }
    case FETCH_SAVINGS: {
      return { ...state, isFetching: true };
    }
    case FETCH_SAVINGS_DONE: {
      return {
        ...state,
        isFetching: false,
        savings: action.payload.savings
      };
    }
    case FETCH_SAVINGS_FAILED: {
      return {
        ...state,
        isFetching: false,
        error: action.payload.error
      };
    }
    case SET_CURRENCY: {
      return { ...state, currencyValue: action.payload.newCurrency };
    }
    case FETCH_LATEST_EXCHANGE_RATES_SUCCESS: {
      return { ...state, currencyOptions: action.payload.currencyOptions };
    }
    default:
      return state;
  }
};

export default reducer;
