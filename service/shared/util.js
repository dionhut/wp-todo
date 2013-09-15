exports.pushTileIncompleteCount = function(userId, channel, options) {
	// Get the number unchecked items for this user
	var todoItems = options.tables.getTable("todoItem");
	todoItems.where({
		userId: userId,
		Complete: false
	}).read({
		success: function(results) {
			if(results.length > 0) {
				options.push.mpns.sendTile(channel, {
					count: results.length,
					title: "Todo"
				}, {
					success: function(pushResponse) {
						console.log("Sent push:", pushResponse);
					}
				});
			} else {
				options.push.mpns.sendTile(channel, {
					title: "Todo"
				}, {
					success: function(pushResponse) {
						console.log("Sent push (0 count):", pushResponse);
					}
				});
			}
		}
	});
};