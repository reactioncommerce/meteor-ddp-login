ddp-login
==============

Meteor package that allows you to securely log in to a non-primary DDP connection from a browser or another server using password authentication.

In the Meteor app that needs to connect to another Meteor app, in either client code or server code, do something like the following:

```js
// Get the connection
var conn = DDP.connect(Meteor.absoluteUrl());

// Pass the connection to `DDP.loginWithPassword`, which is otherwise similar to
// the core `Meteor.loginWithPassword` method.
DDP.loginWithPassword(conn, {username: 'admin'}, 'admin', function (error) {
	if (!error) {
	  console.log("Logged in!");
	  conn.call('methodTheRequiresBeingLoggedIn', function () {
	    console.log(arguments);
	  });
	} else {
	  console.log(error);
	}
});
```