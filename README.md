ddp-login
==============
```
meteor add ongoworks:ddp-login
```

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

On the server, you can also log in synchronously by omitting the callback argument.

NOTE: There is code to handle both pre-0.8.2 Meteor and 0.8.2+ Meteor. However, there are some caveats:

* You can only connect from a pre-0.8.2 app to another pre-0.8.2 app, or from a 0.8.2+ app to another 0.8.2+ app. This is due to the way Meteor implemented the login method change.
* If you try to add the latest commit of `ddp-login` as a package in a pre-0.8.2 app, it will not work. Even though the code is backwards compatible, the `package.js` file has an `api.use` call for `sha`, which did not exist before 0.8.2. So you will have to remove that package dependency, or just use an older commit of `ddp-login`.
