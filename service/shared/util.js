exports.pushTileIncompleteCount = function(request, userId) {
	// Get the number unchecked items for this user
	console.log(request.service);
	var todoItems = request.service.tables.getTable("todoItem");
	todoItems.where({
		userId: userId,
		Complete: false
	}).read({
		success: function(results) {
			if(results.length > 0) {
				request.service.push.mpns.sendTile(item.channel, {
					count: results.length,
					title: "Todo"
				}, {
					success: function(pushResponse) {
						console.log("Sent push:", pushResponse);
					}
				});
			} else {
				request.service.push.mpns.sendTile(item.channel, {
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