DDP = DDP || {};
function loginWithPassword(connection, selector, password, callback) {
  callback = callback || function () {};

  if (typeof selector === 'string') {
    if (selector.indexOf('@') === -1)
      selector = {username: selector};
    else
      selector = {email: selector};
  }

  // Use SRP prior to Meteor 0.8.2
  var srp;
  if (typeof SRP.Client === "function") {
    srp = new SRP.Client(password);
  }

  // make sure we only call the user's callback once.
  var onceUserCallback = _.once(callback);

  var reconnected = false;

  function onResultReceived(err, result) {
    if (err || !result || !result.token) {
      connection.onReconnect = null;
    } else {
      connection.onReconnect = function () {
        reconnected = true;
        callLoginMethod([{resume: result.token}]);
      };
    }
  }

  function loggedInAndDataReadyCallback(error, result) {
    // If the login method returns its result but the connection is lost
    // before the data is in the local cache, it'll set an onReconnect (see
    // above). The onReconnect will try to log in using the token, and *it*
    // will call userCallback via its own version of this
    // loggedInAndDataReadyCallback. So we don't have to do anything here.
    if (reconnected)
      return;

    if (error || !result) {
      onceUserCallback(error || new Error("No result from call to login"));
    } else if (srp && !srp.verifyConfirmation({HAMK: result.HAMK})) {
      onceUserCallback(new Error("Server is cheating!"));
    } else {
      // Logged in
      connection.setUserId(result.id);
      onceUserCallback();
    }
  }

  function callLoginMethod(args) {
    connection.apply(
      'login',
      args,
      {wait: true, onResultReceived: onResultReceived},
      loggedInAndDataReadyCallback
    );
  }

  // Begin the actual method calls
  // Use SRP prior to Meteor 0.8.2
  if (srp) {
    var request = srp.startExchange();
    request.user = selector;
    connection.apply(
      'beginPasswordExchange',
      [request],
      function (error, result) {
        if (error || !result) {
          onceUserCallback(error || new Error("No result from call to beginPasswordExchange"));
          return;
        }

        var response = srp.respondToChallenge(result);
        callLoginMethod([{srp: response}]);
      }
    );
  }
  // Use new method as of Meteor 0.8.2
  else {
    function hashPassword(password) {
      return {
        digest: SHA256(password),
        algorithm: "sha-256"
      };
    }

    callLoginMethod([{
      user: selector,
      password: hashPassword(password)
    }]);
  }
}

if (Meteor.isClient) {
  DDP.loginWithPassword = loginWithPassword;
} else {
  // Allow synchronous usage by not passing callback on server
  DDP.loginWithPassword = function ddpLoginWithPassword(connection, selector, password, callback) {
    if (!callback) {
      return Meteor.wrapAsync(loginWithPassword)(connection, selector, password);
    } else {
      return loginWithPassword(connection, selector, password, callback);
    }
  }
}
