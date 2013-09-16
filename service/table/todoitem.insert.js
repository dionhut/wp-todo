var util = require("../shared/util.js");

function insert(item, user, request) {
	item.userId = user.userId;

    util.getPhotoSAS(item, {
    	success: function(photoSAS) {
    		item.photoSAS = photoSAS;

			request.execute({
			    success: function () {
					// Write to the response and then send the notification in the background
					request.respond();

					// Push the count of incomplete items to tile.
					util.pushTileIncompleteCount(user.userId, item.channel, {
						tables: tables,
						push: push
					});
				}
			});
    	},
    	error: function(errorMsg) {
			request.respond(statusCodes.INTERNAL_SERVER_ERROR, errorMsg);
    		console.error(errorMsg);
    	}
    });
}
