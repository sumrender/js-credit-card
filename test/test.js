const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const decache = require('decache');


let cardLinksService = require("../card_links_service");
const { CreditCardState } = require('../constants/credit_card_state');
const { CreditCard } = require('../models/credit_card');
const { CardLink } = require('../models/card_link');


describe('Card linking tests', function() {

	beforeEach(() => {
		decache("../card_links_service");
		cardLinksService = require("../card_links_service");
	});

	it("Test add single credit card", (done) => {
		const creditCard = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		expect(cardLinksService.addCreditCard(creditCard), "Adding a new credit card").to.be.equal(true);

		done();
	})

	it("Test adding two different cards", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "Axis Bank", CreditCardState.ACTIVE);

		expect(cardLinksService.addCreditCard(creditCard1), "Adding a new credit card").to.be.equal(true);
		expect(cardLinksService.addCreditCard(creditCard2), "Adding a new credit card").to.be.equal(true);

		done();
	})

	it("Test adding the same card again", (done) => {
		const creditCard = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);

		expect(cardLinksService.addCreditCard(creditCard), "Adding a new credit card").to.be.equal(true);
		expect(cardLinksService.addCreditCard(creditCard), "Adding the same card again").to.be.equal(false);

		done();
	})

	it("Test adding duplicate card ids", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("1", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		expect(cardLinksService.addCreditCard(creditCard1), "Adding a new credit card").to.be.equal(true);
		expect(cardLinksService.addCreditCard(creditCard2), "Adding duplicate card id").to.be.equal(false);

		done();
	})

	it("Test adding duplicate card numbers", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "1234", "Axis Bank", CreditCardState.ACTIVE);

		expect(cardLinksService.addCreditCard(creditCard1), "Adding a new credit card").to.be.equal(true);
		expect(cardLinksService.addCreditCard(creditCard2), "Adding duplicate card number").to.be.equal(false);

		done();
	})

	it("Test linking cards with same issuer", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);

		expect(cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason"), "Linking cards").to.be.equal(true);

		done();
	})

	it("Test linking cards with different issuer", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "Axis Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);

		expect(cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason"), "Linking cards").to.be.equal(false);

		done();
	})

	it("Test linking three cards with same issuer", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard3 = new CreditCard("3", "3456", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.addCreditCard(creditCard3);

		expect(cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason"), "Linking cards").to.be.equal(true);
		expect(cardLinksService.linkCreditCards(creditCard3.id, creditCard1.id, "random reason"), "Linking cards").to.be.equal(true);

		done();
	})

	it("Test linking three cards, one valid - one invalid", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard3 = new CreditCard("3", "3456", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.addCreditCard(creditCard3);

		expect(cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason"), "Linking cards").to.be.equal(true);
		expect(cardLinksService.linkCreditCards(creditCard1.id, creditCard3.id, "random reason"), "Linking cards").to.be.equal(false);

		done();
	})

	it("Test linking four cards, 2 valid - 1 invalid", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard3 = new CreditCard("3", "3456", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard4 = new CreditCard("4", "4567", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.addCreditCard(creditCard3);
		cardLinksService.addCreditCard(creditCard4);

		expect(cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason"), "Linking cards").to.be.equal(true);
		expect(cardLinksService.linkCreditCards(creditCard3.id, creditCard4.id, "random reason"), "Linking cards").to.be.equal(true);
		expect(cardLinksService.linkCreditCards(creditCard2.id, creditCard3.id, "random reason"), "Linking cards").to.be.equal(false);

		done();
	})

	it("Test de linking card", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");

		expect(cardLinksService.deLinkCreditCard(creditCard1.id), "De linking cards").to.be.equal(true);

		done();
	})

	it("Test de linking with invalid group id", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");

		expect(cardLinksService.deLinkCreditCard(creditCard2.id), "De linking cards").to.be.equal(false);

		done();
	})

	it("Test de linking with no existing links", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);

		expect(cardLinksService.deLinkCreditCard(creditCard1.id), "De linking cards").to.be.equal(false);
		expect(cardLinksService.deLinkCreditCard(creditCard2.id), "De linking cards").to.be.equal(false);

		done();
	})

	it("Test de linking with three cards", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard3 = new CreditCard("3", "3456", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.addCreditCard(creditCard3);

		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");
		cardLinksService.linkCreditCards(creditCard3.id, creditCard1.id, "random reason");


		expect(cardLinksService.deLinkCreditCard(creditCard1.id), "De linking cards").to.be.equal(false);
		expect(cardLinksService.deLinkCreditCard(creditCard3.id), "De linking cards").to.be.equal(true);

		done();
	})

	it("Test de linking all three cards", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard3 = new CreditCard("3", "3456", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.addCreditCard(creditCard3);

		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");
		cardLinksService.linkCreditCards(creditCard3.id, creditCard1.id, "random reason");


		expect(cardLinksService.deLinkCreditCard(creditCard3.id), "De linking cards").to.be.equal(true);
		expect(cardLinksService.deLinkCreditCard(creditCard1.id), "De linking cards").to.be.equal(true);

		done();
	})

	it("Test card link swap", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);

		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");


		expect(cardLinksService.swap(creditCard1.id), "Swapping links").to.be.equal(true);

		done();
	})

	it("Test card link swap with invalid group id", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);

		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");


		expect(cardLinksService.swap(creditCard2.id), "Swapping links").to.be.equal(false);

		done();
	})

	it("Test swap with no linked card", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);

		expect(cardLinksService.swap(creditCard1.id), "Swapping links").to.be.equal(false);

		done();
	})

	it("Test link chain for no linked card", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);

		expect(cardLinksService.getLinkChain(creditCard1.id)).deep.to.equal([]);

		done();
	})

	it("Test get link chain for two cards", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);

		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");

		expect(cardLinksService.getLinkChain(creditCard1.id)).deep.to.equal(
			[new CardLink("1", "2", "1", "random reason")]
		);

		done();
	})

	it("Test get link chain for three cards", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard3 = new CreditCard("3", "3456", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.addCreditCard(creditCard3);

		cardLinksService.linkCreditCards(creditCard2.id, creditCard3.id, "random reason");
		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");

		expect(cardLinksService.getLinkChain(creditCard2.id)).deep.to.equal([]);
		expect(cardLinksService.getLinkChain(creditCard3.id)).deep.to.equal([]);

		expect(cardLinksService.getLinkChain(creditCard1.id)).deep.to.equal([
			new CardLink("1", "2", "1", "random reason"),
			new CardLink("2", "3", "1", "random reason")
		]);

		done();
	})

	it("Test get link chain for linked and swapped cards", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);

		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");

		cardLinksService.swap(creditCard1.id);

		expect(cardLinksService.getLinkChain(creditCard1.id)).deep.to.equal([]);
		expect(cardLinksService.getLinkChain(creditCard2.id)).deep.to.equal([
			new CardLink("2", "1", "2", "random reason"),
		]);

		done();
	})

	it("Test get link chain for linked, delinked and swapped cards", (done) => {
		const creditCard1 = new CreditCard("1", "1234", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard2 = new CreditCard("2", "2345", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard3 = new CreditCard("3", "3456", "HDFC Bank", CreditCardState.ACTIVE);
		const creditCard4 = new CreditCard("4", "4567", "HDFC Bank", CreditCardState.ACTIVE);

		cardLinksService.addCreditCard(creditCard1);
		cardLinksService.addCreditCard(creditCard2);
		cardLinksService.addCreditCard(creditCard3);
		cardLinksService.addCreditCard(creditCard4);

		cardLinksService.linkCreditCards(creditCard3.id, creditCard4.id, "random reason");
		cardLinksService.linkCreditCards(creditCard2.id, creditCard3.id, "random reason");
		cardLinksService.linkCreditCards(creditCard1.id, creditCard2.id, "random reason");

		expect(cardLinksService.getLinkChain(creditCard2.id)).deep.to.equal([]);
		expect(cardLinksService.getLinkChain(creditCard3.id)).deep.to.equal([]);
		expect(cardLinksService.getLinkChain(creditCard4.id)).deep.to.equal([]);


		expect(cardLinksService.getLinkChain(creditCard1.id)).deep.to.equal([
			new CardLink("1", "2", "1", "random reason"),
			new CardLink("2", "3", "1", "random reason"),
			new CardLink("3", "4", "1", "random reason"),
		]);

		cardLinksService.swap(creditCard1.id);

		expect(cardLinksService.getLinkChain(creditCard2.id)).deep.to.equal([
			new CardLink("2", "1", "2", "random reason"),
			new CardLink("1", "3", "2", "random reason"),
			new CardLink("3", "4", "2", "random reason"),
		]);

		cardLinksService.deLinkCreditCard(creditCard2.id);

		expect(cardLinksService.getLinkChain(creditCard1.id)).deep.to.equal([
			new CardLink("1", "3", "1", "random reason"),
			new CardLink("3", "4", "1", "random reason"),
		]);

		cardLinksService.swap(creditCard1.id);

		expect(cardLinksService.getLinkChain(creditCard3.id)).deep.to.equal([
			new CardLink("3", "1", "3", "random reason"),
			new CardLink("1", "4", "3", "random reason"),
		]);

		done();
	})
});