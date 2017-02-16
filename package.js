Package.describe({
  summary: "Securely log in to a non-primary DDP connection from another browser or server",
  name: "ongoworks:ddp-login",
  version: "0.2.2",
  git: "https://github.com/ongoworks/meteor-ddp-login.git"
});

Package.on_use(function (api) {
  api.versionsFrom(["METEOR@0.9.0","METEOR@1.4.2"]);
  api.use(['livedata', 'underscore', 'srp', 'sha']);
  api.add_files(['ddp-login.js']);
});

Package.on_test(function(api) {
  api.use(['accounts-password@1.3.4', 'ongoworks:ddp-login@0.2.2', 'test-helpers', 'tinytest', 'ddp', 'sha']);
  api.add_files(["ddp-login-tests.js"]);
});
