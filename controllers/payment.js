//Stripe payment gateway
const key = process.env.SECRET_KEY;
const stripe = require("stripe")(key);
const { v4: uuid } = require('uuid');

exports.makeStripePayment = (req, res) => {
  const { products, token } = req.body;

  let amount = 0;
  products.map((p) => {
    amount += p.price;
  });

  //creates unique key so that user should not be charged twice in case of any network error
  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "A payment to buy T-Shirts",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                zip: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log("FAILED"));
};

//Braintree payment gateway
var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "5rsr8h4qm5m8xtrf",
  publicKey: "945sw2mv8vcjvzyd",
  privateKey: "3ca046375ddf49079a63710bf8b80268",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send(response);
    }
  });
};

exports.makeTransaction = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    }
  );
};