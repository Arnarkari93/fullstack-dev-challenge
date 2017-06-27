import "rxjs";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";
import fetch from "isomorphic-fetch";

export const SET_FIELD = "SET_FIELD";
export const setField = value => ({
  type: SET_FIELD,
  payload: { value } // e.g { interestRate: 2 }
});

export const FETCH_SAVINGS = "FETCH_SAVINGS";
export const fetchSavings = (
  initialAmount,
  monthlySavings,
  interestRate,
  interestCalculation
) => ({
  type: FETCH_SAVINGS,
  payload: { initialAmount, monthlySavings, interestRate, interestCalculation }
});

export const FETCH_SAVINGS_DONE = "FETCH_SAVINGS_DONE";
export const fetchSavingsDone = savings => ({
  type: FETCH_SAVINGS_DONE,
  payload: { savings }
});

export const FETCH_SAVINGS_FAILED = "FETCH_SAVINGS_FAILED";
export const fetchSavingsFailed = error => ({
  type: FETCH_SAVINGS_FAILED,
  payload: { error }
});

export const SET_CURRENCY = "SET_CURRENCY";
export const setCurrency = (newCurrency, oldCurrency) => ({
  type: SET_CURRENCY,
  payload: { newCurrency, oldCurrency }
});

export const FETCH_LATEST_EXCHANGE_RATES = "FETCH_LATEST_EXCHANGE_RATES";
export const fetchLatestExchangeRates = () => ({
  type: FETCH_LATEST_EXCHANGE_RATES
});

export const FETCH_LATEST_EXCHANGE_RATES_SUCCESS =
  "FETCH_LATEST_EXCHANGE_RATES_SUCCESS";
export const fetchLatestExchangeRatesSuccess = currencyOptions => ({
  type: FETCH_LATEST_EXCHANGE_RATES_SUCCESS,
  payload: { currencyOptions }
});

export const FETCH_LATEST_EXCHANGE_RATES_FAILURE =
  "FETCH_LATEST_EXCHANGE_RATES_FAILURE";
export const fetchLatestExchangeRatesFailure = error => ({
  type: FETCH_LATEST_EXCHANGE_RATES_FAILURE,
  payload: { error }
});

const updateSavingsEpic = (action$, store) =>
  action$.filter(action => action.type === SET_FIELD).map(({ payload }) => {
    const {
      initialSavings,
      monthlySavings,
      interestRate,
      interestCalculationType
    } = store.getState();

    return fetchSavings(
      initialSavings,
      monthlySavings,
      interestRate,
      interestCalculationType
    );
  });

export const fetchSavingsEpic = (action$, store) =>
  action$.filter(action => action.type === FETCH_SAVINGS).mergeMap(({
    payload
  }) => {
    const {
      initialAmount,
      monthlySavings,
      interestRate,
      interestCalculation
    } = payload;

    const years = 50; // TODO make available for user input
    return Observable.fromPromise(
      fetch(
        `/interests?years=${years}&initialAmount=${initialAmount}&monthlySavings=${monthlySavings}&interestRate=${1 + interestRate * 0.01}&interestCalculation=${interestCalculation}`
      )
    )
      .mergeMap(res => Observable.fromPromise(res.json()))
      .map(json => fetchSavingsDone(json))
      .catch(error => Observable.of(fetchSavingsFailed(error)));
  });

const updateCurrencyEpic = (action$, store) => {
  const getRate = (oldCurrency, newCurrency) =>
    Observable.fromPromise(
      fetch(
        `http://api.fixer.io/latest?base=${oldCurrency}&symbols=${newCurrency}`
      )
    )
      .mergeMap(res => Observable.fromPromise(res.json()))
      .map(json => json.rates[newCurrency]) // get the currency rate difference
      .catch(error => FETCH_LATEST_EXCHANGE_RATES_FAILURE(error));

  return action$.filter(action => action.type === SET_CURRENCY).mergeMap(({
    payload
  }) => {
    const { initialSavings, monthlySavings } = store.getState();
    const { newCurrency, oldCurrency } = payload;

    return getRate(oldCurrency, newCurrency).mergeMap(rate =>
      Observable.of(
        setField({
          initialSavings: (initialSavings * rate).toPrecision(4),
          monthlySavings: (monthlySavings * rate).toPrecision(4)
        })
      )
    );
  });
};

const fetchLatestExchangeRatesEpic = action$ =>
  action$
    .filter(action => action.type === FETCH_LATEST_EXCHANGE_RATES)
    .mergeMap(() =>
      Observable.fromPromise(fetch("http://api.fixer.io/latest"))
        .mergeMap(res => Observable.fromPromise(res.json()))
        .map(data => [data.base, ...Object.keys(data.rates)])
        .map(rates => fetchLatestExchangeRatesSuccess(rates))
    )
    .catch(error => Observable.of(fetchLatestExchangeRatesFailure(error)));

export const epic = combineEpics(
  updateSavingsEpic,
  updateCurrencyEpic,
  fetchSavingsEpic,
  fetchLatestExchangeRatesEpic
);
