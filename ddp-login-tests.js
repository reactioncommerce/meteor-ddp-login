if (Meteor.isServer) {
  Meteor.methods({
    tester: function () {
      if (this.userId) {
        return true;
      } else {
        return false;
      }
    }
  });

  function init() {
    if (Meteor.users.find().count() === 0) {
      // If we have no users, create one initial default user
      Accounts.createUser({
        username: 'admin',
        password: 'admin',
        profile: {
          name: 'Default Admin'
        }
      });
    }
  }
  init();

  Tinytest.addAsync('ddp-login - init', function(test, next) {
    init();
    test.equal(Meteor.users.find().count(), 1, "Expected one test user created");
    next();
  });

  Tinytest.add('ddp-login - sync', function(test) {
    var conn = DDP.connect(Meteor.absoluteUrl());
    test.isTrue(!!conn);
    var result = conn.call('tester');
    // Result will be false because we are not logged in
    test.isFalse(result);
    // Now log in
    DDP.loginWithPassword(conn, {username: 'admin'}, 'admin');
    // Now try the method call again as an authenticated user
    result = conn.call('tester');
    // Result will be true because we are logged in
    test.isTrue(result);
  });
}

Tinytest.addAsync('ddp-login - login', function(test, next) {
  var conn = DDP.connect(Meteor.absoluteUrl());

  test.isTrue(!!conn);

  conn.call('tester', function (error, result) {
    // Result will be false because we are not logged in
    test.isFalse(!!error);
    test.isFalse(result);

    // Now log in
    DDP.loginWithPassword(conn, {username: 'admin'}, 'admin', function (error) {
      test.isFalse(!!error);

      // Now try the method call again as an authenticated user
      conn.call('tester', function (error, result) {
        // Result will be true because we are logged in
        test.isFalse(!!error);
        test.isTrue(result);
        next();
      });
    });
  });
});