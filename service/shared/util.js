exports.pushTileIncompleteCount = function(request, userId) {
	// Get the number unchecked items for this user
	var todoItems = request.tables.getTable("todoItem");
	todoItems.where({
		userId: userId,
		Complete: false
	}).read({
		success: function(results) {
			if(results.length > 0) {
				request.push.mpns.sendTile(item.channel, {
					count: results.length,
					title: "Todo"
				}, {
					success: function(pushResponse) {
						console.log("Sent push:", pushResponse);
					}
				});
			} else {
				request.push.mpns.sendTile(item.channel, {
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