const request = require("supertest");
describe("loading express", () => {
  let server;
  beforeEach(() => {
    server = require("./server");
  });

  afterEach(() => {
    server.close();
  });

  it("responds to /interests", done => {
    request(server).get("/interests").expect(200, done);
  });

  it("responds to /interests and should return array with only the initialAmount", done => {
    const expectedResult = Array.apply(null, { length: 12 }).map(x => 100);
    request(server)
      .get("/interests")
      .query({ initialAmount: 100 })
      .expect("Content-Type", /json/)
      .expect(200, expectedResult, done);
  });

  it("responds to /interests and should return array with no interest rate", done => {
    const expectedResult = Array.apply(null, { length: 12 }).map(
      (x, i) => 100 + i * 10
    );
    request(server)
      .get("/interests")
      .query({ initialAmount: 100, monthlySavings: 10 })
      .expect("Content-Type", /json/)
      .expect(200, expectedResult, done);
  });

  it("responds to /interests and should return array with interest rate calculated monthly", done => {
    const interestRate = 1.01;
    const expectedResult = [
      100,
      111.1,
      122.3,
      133.6,
      145.1,
      156.6,
      168.3,
      180.1,
      192.0,
      204.0,
      216.1,
      228.4
    ];

    request(server)
      .get("/interests")
      .query({
        initialAmount: 100,
        monthlySavings: 10,
        interestRate,
        interestCalculation: "Monthly"
      })
      .expect("Content-Type", /json/)
      .expect(200, expectedResult, done);
  });

  it("responds to /interests and should return array with interest rate calculated monthly", done => {
    const interestRate = 1.01;
    const expectedResult = [
      100,
      110,
      120,
      130,
      140,
      150,
      160,
      170,
      180,
      190,
      200,
      212.1 // interest calculated
    ];

    request(server)
      .get("/interests")
      .query({
        initialAmount: 100,
        monthlySavings: 10,
        interestRate,
        interestCalculation: "Annually"
      })
      .expect("Content-Type", /json/)
      .expect(200, expectedResult, done);
  });

  it("responds to /interests and should return array with interest rate calculated quarterly", done => {
    const interestRate = 1.01;
    const expectedResult = [
      100,
      110,
      120,
      131.3, // interest calculated
      141.3,
      151.3,
      162.9, // interest calculated
      172.9,
      182.9,
      194.8, // interest calculated
      204.8,
      214.8
    ];

    request(server)
      .get("/interests")
      .query({
        initialAmount: 100,
        monthlySavings: 10,
        interestRate,
        interestCalculation: "Quarterly"
      })
      .expect("Content-Type", /json/)
      .expect(200, expectedResult, done);
  });

  it("404 everything else", done => {
    request(server).get("/foo").expect(404, done);
  });
});
