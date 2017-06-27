import * as actions from "./actions";
import "rxjs";
import nock from "nock";
import configureMockStore from "redux-mock-store";
import { createEpicMiddleware, combineEpics } from "redux-observable";

const epicMiddleware = createEpicMiddleware(actions.epic);
const mockStore = configureMockStore([epicMiddleware]);

describe("actions", () => {
  it("should set initialSavings to 100", () => {
    const expectedAction = {
      type: actions.SET_FIELD,
      payload: { value: { initialSavings: 100 } }
    };
    const value = { initialSavings: 100 };
    expect(actions.setField(value)).toEqual(expectedAction);
  });

  it("should set initialSavings and monthlySavings to 100", () => {
    const expectedAction = {
      type: actions.SET_FIELD,
      payload: { value: { initialSavings: 100, monthlySavings: 100 } }
    };
    const value = { initialSavings: 100, monthlySavings: 100 };
    expect(actions.setField(value)).toEqual(expectedAction);
  });

  it("should set currency to EUR", () => {
    const expectedAction = {
      type: actions.SET_CURRENCY,
      payload: { newCurrency: "EUR", oldCurrency: "GPB" }
    };
    expect(actions.setCurrency("EUR", "GPB")).toEqual(expectedAction);
  });
});

describe("updateCurrencyEpic", () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    nock.cleanAll();
    epicMiddleware.replaceEpic(actions.epic);
  });

  it("should dispatch SET_CURRENCY action", () => {
    const oldCurrency = "GPB", newCurrency = "EUR";

    store.dispatch({
      type: actions.SET_CURRENCY,
      payload: { newCurrency, oldCurrency }
    });

    expect(store.getActions()).toEqual([
      {
        type: actions.SET_CURRENCY,
        payload: { newCurrency, oldCurrency }
      }
    ]);
  });
});

describe("fetchSavingsEpic", () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    nock.cleanAll();
    epicMiddleware.replaceEpic(actions.epic);
  });

  it("should dispatch FETCH_SAVINGS action", () => {
    const oldCurrency = "GPB", newCurrency = "EUR";
    const payload = 0.5;
    const initialAmount = 10,
      monthlySavings = 1,
      interestRate = 0.01,
      interestCalculation = "Annually";

    store.dispatch({
      type: actions.FETCH_SAVINGS,
      payload: {
        initialAmount,
        monthlySavings,
        interestRate,
        interestCalculation
      }
    });

    nock("http://localhost:3000")
      .get(
        `/interests?initialAmount=${initialAmount}&monthlySavings=${monthlySavings}&interestRate=${1 + interestRate * 0.01}&interestCalculation=${interestCalculation}`
      )
      .reply(200, 0.5);

    expect(store.getActions()).toEqual([
      {
        type: actions.FETCH_SAVINGS,
        payload: {
          initialAmount,
          monthlySavings,
          interestRate,
          interestCalculation
        }
      }
    ]);
  });
});
