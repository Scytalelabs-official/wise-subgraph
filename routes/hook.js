// Initialize WebHooks module.
var WebHooks = require("node-webhooks");

// Initialize webhooks module with object; changes will only be
// made in-memory
var webHooks = new WebHooks({
  db: { addPost: ["http://localhost:3000/"] }, // our backend link
});

// sync instantation - add a new webhook called 'hook'
webHooks
  .add("hook", "http://localhost:3000/geteventsdata")
  .then(function () {
    // done
  })
  .catch(function (err) {
    console.log(err);
  });

var emitter = webHooks.getEmitter();

exports.webHooks = webHooks;
exports.emitter = emitter;
