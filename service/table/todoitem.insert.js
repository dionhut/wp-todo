function insert(item, user, request) {
	item.userId = user.userId;

	if(item.photoName && item.photoName.length > 0) {
		var azure = require('azure');
		var blobService = azure.createBlobService("wptodo", "vYX3v/kZcFsgNlVLgkj6prW+fL98a6jIX1ZqTh8YKi7Bmq4V4Ld3QHIp8WD4/mR6XJSTpemosE4nutYDrkQduA==");
		//create a SAS that expires in an hour
		var expires = new Date();
		expires.setMinutes(expires.getMinutes() + 60);
		var sharedAccessPolicy = { 
		    AccessPolicy: {
		        Expiry: azure.date.minutesFromNow(60)
		    }
		};
		console.log("sharedAccessPolicy:%j", sharedAccessPolicy);
		var photoSAS = blobService.getBlobUrl("photos", item.photoName, sharedAccessPolicy);
		console.log("photoSAS:%j", photoSAS);
		item.photoSAS = photoSAS.baseUrl + photoSAS.path;
	}

    request.execute({
        success: function () {
			// Write to the response and then send the notification in the background
			request.respond();

			// Push the count of incomplete items to tile.
			var util = require("../shared/util.js");
			util.pushTileIncompleteCount(user.userId, item.channel, {
				tables: tables,
				push: push
			});
		}
	});
}