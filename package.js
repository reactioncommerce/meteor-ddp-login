Package.describe({
  summary: "Meteor package that allows you to securely log in to a non-primary DDP connection from a browser or another server",
  name: "ongoworks:ddp-login"
  version: "0.1.0",
  git: "https://github.com/ongoworks/meteor-ddp-login.git"
});

Package.on_use(function (api) {
  api.use(['livedata', 'underscore', 'srp', 'sha']);
  api.add_files(['ddp-login.js']);
});

Package.on_test(function(api) {
  api.use(['accounts-password', 'ddp-login', 'test-helpers', 'tinytest']);
  api.add_files(["ddp-login-tests.js"]);
});