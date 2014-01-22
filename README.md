toucan
======

## Super simple access tokens for Javascript

Create access tokens with a set of permissions, then pass the token around and let consumers check the token for permissions when needed.


Getting Started
---------------

Install toucan
```sh
npm install toucan --save
```

A simple example

```javascript
var Toucan = require('toucan');

var token = new Toucan();
token.permit('eat')
     .deny('jump')
     .lock();


// Elsewhere in your application
token.can('eat');
    => true

token.can('jump');
    => false
```


Example with roles
------------------

```javascript
var Toucan = require('toucan');

var RoleToken = module.exports = function(role){
    var token = new Toucan();

    if(role == 'admin')
    {
        token.permit('edit all users')
             .permit('edit files');
    }

    if(role == 'admin' || role == 'user')
    {
        token.permit('edit own profile')
             .permit('edit own files');
    }

    token.permit('view public pages');

    if(role == 'banned')
    {
        token.deny('view public pages');
    }

    return token.lock();
}
```

```javascript
var token;

if(user)
{
    token = RoleToken(user.role);
}else{
    token = RoleToken('guest');
}

if(user.can('edit own profile'))
{
    // ..... edit profile ......
}
```


Allow by default
----------------
By default, everything is denied unless explicitly permitted. You can enable allow-by-default by permitting '*'.

```javascript
var Toucan = require('toucan');

var token = new Toucan();
token
    .permit('*')
    .deny('jump')
    .lock()


// All permissions are allowed
token.can('do absolutely anything');
    => true

// Except this one, because it was explicitly denied
token.can('jump');
    => false
```