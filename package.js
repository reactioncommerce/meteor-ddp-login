Package.describe({
  summary: "Securely log in to a non-primary DDP connection from another browser or server",
  name: "ongoworks:ddp-login",
  version: "0.2.1",
  git: "https://github.com/ongoworks/meteor-ddp-login.git"
});

Package.on_use(function (api) {
  api.versionsFrom("METEOR@0.9.0")
  api.use(['livedata', 'underscore', 'srp', 'sha']);
  api.add_files(['ddp-login.js']);
});

Package.on_test(function(api) {
  api.use(['accounts-password', 'ongoworks:ddp-login', 'test-helpers', 'tinytest']);
  api.add_files(["ddp-login-tests.js"]);
});
