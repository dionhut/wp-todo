function insert(item, user, request) {
	item.userId = user.userId;
    request.execute({
        success: function () {
			// Write to the response and then send the notification in the background
			request.respond();
			// Get the number unchecked items for this user
			var todoItems = tables.getTable("todoItem");
			todoItems.where({
				userId: user.userId,
				Complete: false
			}).read({
				success: function(results) {
					if(results.length > 0) {
						push.mpns.sendTile(item.channel, {
							count: results.length,
							title: "Todo"
						}, {
							success: function(pushResponse) {
								console.log("Sent push:", pushResponse);
							}
						});
					} else {
						push.mpns.sendTile(item.channel, {
							title: "Todo"
						}, {
							success: function(pushResponse) {
								console.log("Sent push (0 count):", pushResponse);
							}
						});
					}
				}
			});
		}
	});
}