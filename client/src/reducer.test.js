import reducer from "./reducer";
import * as actions from "./actions";

describe("reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      currencyOptions: [],
      currencyValue: "GBP",
      initialSavings: 0,
      interestCalculationType: "Annually",
      interestRate: 4,
      isFetching: false,
      monthlySavings: 0,
      savings: []
    });
  });

  it("should set the initial savings", () => {
    expect(
      reducer(undefined, {
        type: actions.SET_FIELD,
        payload: {
          value: { initialSavings: 100 }
        }
      })
    ).toEqual({
      currencyOptions: [],
      currencyValue: "GBP",
      initialSavings: 100,
      interestCalculationType: "Annually",
      interestRate: 4,
      isFetching: false,
      monthlySavings: 0,
      savings: []
    });
  });

  it("should set the initial savings and monthlySavings", () => {
    expect(
      reducer(undefined, {
        type: actions.SET_FIELD,
        payload: {
          value: { initialSavings: 100, monthlySavings: 10 }
        }
      })
    ).toEqual({
      currencyOptions: [],
      currencyValue: "GBP",
      initialSavings: 100,
      interestCalculationType: "Annually",
      interestRate: 4,
      isFetching: false,
      monthlySavings: 10,
      savings: []
    });
  });

  it("should set currency value", () => {
    expect(
      reducer(undefined, {
        type: actions.SET_CURRENCY,
        payload: {
          newCurrency: "EUR"
        }
      })
    ).toEqual({
      currencyOptions: [],
      currencyValue: "EUR",
      initialSavings: 0,
      interestCalculationType: "Annually",
      interestRate: 4,
      isFetching: false,
      monthlySavings: 0,
      savings: []
    });
  });
});
