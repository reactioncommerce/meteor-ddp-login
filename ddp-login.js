DDP = DDP || {};
DDP.loginWithPassword = function loginWithPassword(connection, selector, password, callback) {
	callback = callback || function () {};

	var srp = new SRP.Client(password);
	var request = srp.startExchange();

	if (typeof selector === 'string')
	  if (selector.indexOf('@') === -1)
	    selector = {username: selector};
	  else
	    selector = {email: selector};

	request.user = selector;

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
	  } else if (!srp.verifyConfirmation({HAMK: result.HAMK})) {
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