const express = require("express");

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// This route gets data that shows how savings will be worth the next 50 years
// Query params:
//   initialAmount: number -> the initial amount already in savings (Default: 0)
//   monthlySavings: number -> amount put in savings each month (Default: 0)
//   interestRate: number -> percentage of interest rate (e.g 1.04 -> 4%) (Default: 0%)
//   interestCalculation:  'Monthly' | 'Quarterly' | 'Annually'
//     -> when interest rate is calculated (Default: 'Annually').
app.get("/interests", (req, res) => {
  // Get input from query parameters
  const {
    initialAmount,
    interestCalculation,
    interestRate,
    monthlySavings,
    years
  } = getInterestQueryParams(req.query);

  // Create array where each entry represents a month.
  const interestArr = [+initialAmount];

  let amount = +initialAmount;
  // Calculate savings each month for 50 years.
  for (let i = 1; i < 12 * years; i++) {
    // calculate interest rate
    amount += +monthlySavings;
    switch (interestCalculation) {
      case "Monthly": {
        amount = amount * interestRate;
        break;
      }
      case "Quarterly": {
        if (i % 3 === 0) {
          amount = amount * interestRate;
        }
        break;
      }
      case "Annually":
      default:
        if (i % (12 - 1) === 0) {
          amount = amount * interestRate;
        }
    }
    interestArr.push(+amount.toPrecision(4));
  }

  res.send(interestArr);
});

function getInterestQueryParams(queryParams) {
  const initialAmount = queryParams["initialAmount"]
    ? +queryParams["initialAmount"]
    : 0;

  const monthlySavings = queryParams["monthlySavings"]
    ? +queryParams["monthlySavings"]
    : 0;

  const interestRate = queryParams["interestRate"]
    ? +queryParams["interestRate"]
    : 1;

  const interestCalculation = queryParams["interestCalculation"]
    ? queryParams["interestCalculation"]
    : "Annually";

  const years = queryParams["years"] ? queryParams["years"] : 1;

  return {
    initialAmount,
    monthlySavings,
    interestRate,
    interestCalculation,
    years
  };
}

const server = app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

module.exports = server;
