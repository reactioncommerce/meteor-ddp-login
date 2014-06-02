Package.describe({
  name: "ddp-login",
  summary: "Meteor package that allows you to securely log in to a non-primary DDP connection from a browser or another server"
});

Package.on_use(function (api) {  
  api.use(['livedata', 'srp', 'underscore']);
  api.add_files(['ddp-login.js']);
});

Package.on_test(function(api) {
  api.use(['accounts-password', 'ddp-login', 'test-helpers', 'tinytest']);
  api.add_files(["ddp-login-tests.js"]);
});