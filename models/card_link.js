"use strict";


class CardLink {

	/**
	 * @param {string} primaryCardId
	 * @param {string} linkedCardId
	 * @param {string} groupId
	 * @param {string} reason
	 */

	constructor(primaryCardId, linkedCardId, groupId, reason) {
		this.primaryCardId = primaryCardId;
		this.linkedCardId = linkedCardId;
		this.groupId = groupId;
		this.reason = reason;
	}
}

module.exports.CardLink = CardLink;