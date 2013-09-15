function insert(item, user, request) {
	request.execute({
		success: function () {
			// Write to the response and then send the notification in the background
			request.respond();

			// Push the count of incomplete items to tile.
			var util = require("../shared/util.js");
			util.pushTileIncompleteCount(user.userId, {
				tables: tables,
				push: push
			});
		}
	});
}