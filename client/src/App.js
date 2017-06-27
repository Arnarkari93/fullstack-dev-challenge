import React, { Component } from "react";
import { connect } from "react-redux";
import CurrencyInput from "./components/CurrencyInput";
import SliderInput from "./components/SliderInput";
import DisplayGraph from "./components/DisplayGraph";
import InterestCalculationType from "./components/InterestCalculationType";
import ChangeCurrency from "./components/ChangeCurrency";
import { fetchSavings, setField } from "./actions";
import "./App.css";

class App extends Component {
  render() {
    const { savings, setField } = this.props;
    const savingsData = !savings
      ? []
      : savings.map((s, i) => ({ month: i + 1, amount: s }));

    return (
      <div className="App">
        <div className="header-banner">
          <h1 className="fmz-white-font">
            Finimize Interest Rate Calculator
          </h1>
        </div>
        <div className="financial-inputs">
          <ChangeCurrency value="EUR" onSet={val => console.log("val", val)} />
          <p className="input-label">How much have you saved?</p>
          <CurrencyInput
            value={this.props.initialSavings || 0}
            onSet={value => setField({ initialSavings: value })}
          />

          <p className="input-label">How much will you save each month?</p>
          <CurrencyInput
            value={this.props.monthlySavings || 0}
            onSet={value => setField({ monthlySavings: value })}
          />

          <p className="input-label">
            When are the interest rate calculated?
          </p>
          <InterestCalculationType
            value={this.props.interestCalculationType || "Annually"}
            onSet={value => setField({ interestCalculationType: value })}
          />

          <p className="input-label">
            How much interest will you earn per year?
          </p>
          <SliderInput
            value={this.props.interestRate ? +this.props.interestRate : 4}
            onSet={value => setField({ interestRate: value })}
          />

        </div>
        {this.props.error && <div>Failed to get savings data</div>}
        <div className="financial-display">
          {/*We have included some sample data here, you will need to replace this
					with your own. Feel free to change the data structure if you wish.*/}
          {this.props.isFetching && <div>Loading...</div>}
          <DisplayGraph data={savingsData} />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    initialSavings: state.initialSavings,
    monthlySavings: state.monthlySavings,
    interestRate: state.interestRate,
    interestCalculationType: state.interestCalculationType,
    savings: state.savings,
    isFetching: state.isFetching
  }),
  { fetchSavings, setField }
)(App);
