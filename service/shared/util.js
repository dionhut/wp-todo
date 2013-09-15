exports.pushTileIncompleteCount = function(userId, channel, options) {
	// Get the number unchecked items for this user
	var todoItems = options.tables.getTable("todoItem");
	todoItems.where({
		userId: userId,
		Complete: false
	}).read({
		success: function(results) {
			console.log("Incomplete items:%j", results);
			var payload = {
				count: results.length,
				title: "Todo"
			};
			console.log(payload);
			options.push.mpns.sendTile(channel, payload, {
				success: function(pushResponse) {
					console.log("Sent push:", pushResponse);
				}
			});
		}
	});
};