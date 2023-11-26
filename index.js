"use strict";

const cardLinksService = require("./card_links_service");
const { CreditCardState } = require("./constants/credit_card_state");
const { CreditCard } = require("./models/credit_card");
const { CardLink } = require("./models/card_link");

const creditCard1 = new CreditCard(
  "1",
  "1234",
  "HDFC Bank",
  CreditCardState.ACTIVE
);
const creditCard2 = new CreditCard(
  "2",
  "2345",
  "HDFC Bank",
  CreditCardState.ACTIVE
);
const creditCard3 = new CreditCard(
  "3",
  "3456",
  "HDFC Bank",
  CreditCardState.ACTIVE
);
const creditCard4 = new CreditCard(
  "4",
  "4567",
  "HDFC Bank",
  CreditCardState.ACTIVE
);

cardLinksService.addCreditCard(creditCard1);
cardLinksService.addCreditCard(creditCard2);
cardLinksService.addCreditCard(creditCard3);
cardLinksService.addCreditCard(creditCard4);

cardLinksService.linkCreditCards(
  creditCard3.id,
  creditCard4.id,
  "random reason"
);
cardLinksService.linkCreditCards(
  creditCard2.id,
  creditCard3.id,
  "random reason"
);
cardLinksService.linkCreditCards(
  creditCard1.id,
  creditCard2.id,
  "random reason"
);

const a = cardLinksService.swap(creditCard1.id);
console.log(a);

const b = cardLinksService.getLinkChain(creditCard2.id);
console.log(b);
