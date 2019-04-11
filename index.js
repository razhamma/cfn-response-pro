
rts.SUCCESS = "SUCCESS";
exports.FAILED = "FAILED";
 
exports.send = (event, context, responseStatus, responseData, physicalResourceId) => {
    var https = require("https");
	var url = require("url");
    return new Promise((resolve, reject) => {
	
	var responseBody = JSON.stringify({
         Status: responseStatus,Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,PhysicalResourceId: physicalResourceId || context.logStreamName,StackId: event.StackId,RequestId: event.RequestId,LogicalResourceId: event.LogicalResourceId,Data: responseData})
      .then((responseBody) => {console.log("Response body:\n", responseBody);var parsedUrl = url.parse(event.ResponseURL);})
      .then((parsedUrl) => {var options = {hostname: parsedUrl.hostname, port: 443, path: parsedUrl.path,method: "PUT",headers: {"content-type": "","content-length": responseBody.length}};})
      .then((options) => {var request = https.request(options)})
      .then(request, ((response) => {
         request.on("error", function(error) { 
            console.log("send(..) failed executing https.request(..): " + error);
            reject(context.done(error));
         });
            console.log("Status code: " + response.statusCode);
            console.log("Status message: " + response.statusMessage);
            resolve();
            request.write(responseBody);
	        request.end();
      }))
      .catch(reject);
})};
