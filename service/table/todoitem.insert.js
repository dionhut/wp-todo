var azure = require('azure'); 
var qs = require('querystring');

function insert(item, user, request) {
	item.userId = user.userId;

    var accountName = 'wptodo';
    var accountKey = 'vYX3v/kZcFsgNlVLgkj6prW+fL98a6jIX1ZqTh8YKi7Bmq4V4Ld3QHIp8WD4/mR6XJSTpemosE4nutYDrkQduA==';         
    //var host =   accountName + '.blob.core.windows.net';
    var container = "photos"
    var canonicalizedResource = '/' +  container + '/' + item.photoName;
    
    //Create the container if it does not exist
    //we will use public read access for the blobs and will use a SAS to upload        
    var blobService = azure.createBlobService(accountName, accountKey);
    blobService.createContainerIfNotExists(container, {publicAccessLevel : 'blob'}, function(error) {            
        if(!error){
            // Container exists now define a policy that provides write access                      
            // that starts immediately and expires in 5 mins        
            var sharedAccessPolicy = {
              AccessPolicy:{
                    Permissions: azure.Constants.BlobConstants.SharedAccessPermissions.WRITE,
                    //Start: //use for start time in future, beware of server time skew 
                    Expiry: formatDate(new Date(new Date().getTime() + 5 * 60 * 1000)) //5 minutes from now
                }
            };
            
            //Generate the SAS for your BLOB
            var sasQueryString = getSAS(accountName,
            	accountKey,
            	canonicalizedResource,
            	azure.Constants.BlobConstants.ResourceTypes.BLOB,
            	sharedAccessPolicy);
            
            //full path for resource with sas
            item.photoSAS =  'https://' + host + canonicalizedResource + '?' + sasQueryString;                                         
        }
        else{
            console.error(error);
        }
    });

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

function getSAS(accountName, accountKey, path, resourceType, sharedAccessPolicy) {                         
	return qs.encode(new azure.SharedAccessSignature(accountName, accountKey).generateSignedQueryString(path, {}, resourceType, sharedAccessPolicy));                           
}

function formatDate(date){ 
	var raw = date.toJSON();
	//blob service does not like milliseconds on the end of the time so strip
	return raw.substr(0, raw.lastIndexOf('.')) + 'Z';
}