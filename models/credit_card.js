"use strict";


class CreditCard {

	/**
	 * @param {string} id
	 * @param {string} cardNumber
	 * @param {string} issuer
	 * @param {string} state // value will be from the CreditCardStatus constants
	 */

	constructor(id, cardNumber, issuer, state) {
		this.id = id;
		this.cardNumber = cardNumber;
		this.issuer = issuer;
		this.state = state;
	}
}

module.exports.CreditCard = CreditCard;