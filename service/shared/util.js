exports.pushTileIncompleteCount = function(userId, channel, options) {
	// Get the number unchecked items for this user
	var todoItems = options.tables.getTable("todoItem");
	todoItems.where({
		userId: userId,
		Complete: false
	}).read({
		success: function(results) {
			console.log("Incomplete items:%j", results);
			options.push.mpns.sendTile(channel, {
				count: results.length || 0,
				title: "Todo"
			}, {
				success: function(pushResponse) {
					console.log("Sent push:", pushResponse);
				}
			});
		}
	});
};