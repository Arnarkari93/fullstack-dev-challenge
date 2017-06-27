import React from "react";
import { connect } from "react-redux";
import { fetchLatestExchangeRates, setCurrency } from "../actions";
import Select from "react-select";
import "react-select/dist/react-select.css";

class ChangeCurrency extends React.Component {
  componentDidMount() {
    this.props.fetchLatestExchangeRates();
  }

  render() {
    const { currencyOptions, currencyValue, setCurrency } = this.props;
    return (
      <div className="fmz-change-currency">
        <Select
          value={currencyValue}
          name="form-change-currency"
          options={(currencyOptions || []).map(option => ({
            value: option,
            label: option
          }))}
          onChange={c => setCurrency(c.value, currencyValue)}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    currencyOptions: state.currencyOptions,
    currencyValue: state.currencyValue
  }),
  { fetchLatestExchangeRates, setCurrency }
)(ChangeCurrency);
