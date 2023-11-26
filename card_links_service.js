"use strict";

const { CreditCard } = require("./models/credit_card");
const { CardLink } = require("./models/card_link");

const cards = new Map();
const cardNumberSet = new Set();

const cardLinked = new Set();
const cardChains = new Map();

/**
 * Checks unique card
 * @param {CreditCard} creditCard
 * @return {boolean}
 */
function hasUniqueIdAndCardNumber(creditCard) {
  if (cards.has(creditCard.id)) {
    return false;
  }
  if (cardNumberSet.has(creditCard.cardNumber)) {
    return false;
  }
  return true;
}

/**
 * Insert card to DS
 * @param {CreditCard} creditCard
 * @return {boolean}
 */
function insertCard(creditCard) {
  cards.set(creditCard.id, creditCard);
  cardNumberSet.add(creditCard.cardNumber);
  return true;
}

/**
 * Adds a credit card to the system. Return true if successful else false
 * @param {CreditCard} creditCard
 * @return {boolean}
 */
const addCreditCard = (creditCard) => {
  if (!hasUniqueIdAndCardNumber(creditCard)) {
    return false;
  }
  return insertCard(creditCard);
};

/**
 * Links two cards. Return true if successful else false
 * @param {string} cardId1
 * @param {string} cardId2
 * @param {string} reason
 * @return {boolean}
 */
const linkCreditCards = (cardId1, cardId2, reason) => {
  // card1 cannot be already linked
  if (cardLinked.has(cardId1)) {
    return false;
  }

  // card2 if linked should be groupId of a chain otherwise,
  // linking not possible
  if (cardLinked.has(cardId2) && !cardChains.has(cardId2)) {
    return false;
  }

  const card1 = cards.get(cardId1);
  const card2 = cards.get(cardId2);

  if (card1.issuer != card2.issuer) {
    return false;
  }

  // new link
  const groupId = cardId1;
  const newLink = new CardLink(cardId1, cardId2, groupId, reason);
  cardLinked.add(cardId1);
  cardLinked.add(cardId2);

  const oldGroupId = cardId2;
  const oldChain = cardChains.has(oldGroupId);

  if (oldChain) {
    const oldChain = cardChains.get(oldGroupId);
    cardChains.delete(oldGroupId);

    oldChain.push(newLink);
    oldChain.forEach((link) => {
      link.groupId = groupId;
    });

    cardChains.set(groupId, oldChain);
    return true;
  }

  // new chain
  const newChain = [];
  newChain.push(newLink);
  cardChains.set(groupId, newChain);

  return true;
};

/**
 *  Deletes link record. Return true if successful else false
 * @param {string} groupId
 * @return {boolean}
 */
const deLinkCreditCard = (groupId) => {
  const oldChain = cardChains.get(groupId);
  if (!oldChain) {
    return false;
  }

  cardChains.delete(groupId);
  const size = oldChain.length;
  const newestLink = oldChain[size - 1];
  cardLinked.delete(newestLink.primaryCardId);
  cardLinked.delete(newestLink.linkedCardId);
  oldChain.pop();

  const arr = [];
  arr.length;

  if (oldChain.length == 0) {
    return true;
  }

  const newHead = oldChain[size - 2];
  oldChain.forEach((link) => {
    link.groupId = newHead.primaryCardId;
  });
  cardChains.set(newHead.primaryCardId, oldChain);
  return true;
};

/**
 * Swaps the two most top level cards of a link group. Return true if successful else false
 * @param {string} groupId
 * @return {boolean}
 */
const swap = (groupId) => {
  const chain = cardChains.get(groupId);
  if (!chain) {
    return false;
  }
  cardChains.delete(groupId);
  const size = chain.length;
  const oldHead = chain[size - 1];
  chain.pop();

  const newGroupId = oldHead.linkedCardId;
  const newLink = new CardLink(
    oldHead.linkedCardId,
    oldHead.primaryCardId,
    newGroupId,
    oldHead.reason
  );
  chain.push(newLink);

  if (size > 1) {
    const secondLink = chain[size - 2];
    const newSecondLink = new CardLink(
      oldHead.primaryCardId,
      secondLink.linkedCardId,
      newGroupId,
      secondLink.reason
    );
    chain[size - 2] = newSecondLink;
  }

  chain.forEach((link) => {
    link.groupId = newGroupId;
  });
  cardChains.set(newGroupId, chain);
  return true;
};

/**
 * Get list of links in order top to bottom. Return true if successful else false
 * @param {string} groupId
 * @return {CardLink[]}
 */
const getLinkChain = (groupId) => {
  const chain = cardChains.get(groupId);
  if (!chain) {
    return [];
  }

  chain.reverse();
  return chain;
};

module.exports = {
  addCreditCard,
  linkCreditCards,
  deLinkCreditCard,
  swap,
  getLinkChain,
};
