# selfbits-angular-sdk

This package allows you to easily integrate the Selfbits Backend-as-Service into your Angular based project. Please note that you MUST have a Selfbits BaaS Account and an active Project to use the service. Check out http://baas.selfbits.org for more info.

Selfbits Backend-as-Service allows you to skip backend development and focus on what's most important for you: your user-experience.

## Features
* [$sbAuth](#sbAuth) - Handles Social & Basic Auth for you
* [$sbDatabase](#sbDatabase) - Puts a ready-to use database integration at your fingertips
* [$sbPush](#sbPush) - Allows to easily use Push Notifications in your App

## Installation

```
# Bower
bower install selfbits-angular-sdk
```

Include the script:

```html
<script src="bower_components/dist/selfbits-angular.min.js"></script>
```

## Usage

### Step 1: App Module

```javascript
angular.module('MyApp', ['selfbitsAngular'])
    .config(function($sbApiProvider) {
        /* Your App Domain */
        $sbApiProvider.domain = 'YourSbAppDomain';
        /* Your Selfbits App ID */
        $sbApiProvider.appId = 'yourSbAppId';
        /* OPTIONAL: your Selfbits App Secret
           NOTE: on public clients we highly recommend to set Allowed Origins in your Selfbits BaaS Project Dashboard instead of using the Secret
        */
        $sbApiProvider.appSecret = 'yourSbAppSecret';
    })
```

### Step 2: Controller
Note: this example uses vm syntax. Using `$scope` is just fine.

```javascript
angular.module('MyApp')
    .controller(function($sbApi, $sbDatabase) {
        var vm = this;
        vm.login = function (user) {
            $sbApi.login(user).then(function() {
                 // DO SOMETHING AFTER LOGIN
                });
        }
        vm.signup = function (user) {
            $sbApi.signup(user).then(function() {
                 // DO SOMETHING AFTER SIGNUP
                });
        }
    })
```

# API Reference

## <a name="sbAuth"></a> `$sbAuth`
* [$sbAuth.login(user)](#sbAuthLogin)
* [$sbAuth.signup(user)](#sbAuthSignup)
* [$sbAuth.social(provider)](#sbAuthSocial)
* [$sbAuth.unlink(provider)](#sbAuthUnlink)
* [$sbAuth.password(newPassword, [oldPassword])](#sbAuthPassword)
* [$sbAuth.logout()](#sbAuthLogout)
* [$sbAuth.getUserId](#sbAuthGetUserId)

### <a name="sbAuthLogin"></a> `$sbAuth.login(user)`
Sign in using email and password:
#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| user         | `Object`      | JavaScript object containing user information |
#### Returns
* __response__ the HTTP response object from the server

#### Usage

```javascript
var user = {
    email: 'abc@def.de',
    password: 'mypassword'
}

$sbAuth.login(user)
  .then(function(response) {
    // Redirect user here after a successful log in.
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
    // for invalid email and/or password.
  });
```

### <a name="sbAuthSignup"></a> `$sbAuth.signup(user)`
Sign up using email and password. You have to make sure to make neccessary sanity checks (e.g. password repeat, password strength).

#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| user         | `Object`      | JavaScript object containing user information |

#### Returns
* __response__ the HTTP response object from the server

#### Usage

```javascript
var user = {
    email: 'abc@def.de',
    password: 'mypassword'
}

$sbAuth.signup(user)
  .then(function(response) {
    // Redirect user here after a successful log in.
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
    // for invalid email and/or password.
  });
```

### <a name="sbAuthSocial"></a> `$sbAuth.social(provider)`
Sign in **OR** up using social providers. Opens a popup window, that leads the user through the social auth flow.

#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| provider     | `String`      | String with the Providername, e.g. 'facebook' |

#### Returns
* __response__ the HTTP response object from the server

#### Usage

```javascript
$sbAuth.social('facebook')
  .then(function(response) {
    // Redirect user here after a successful log in.
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
    // for invalid email and/or password.
  });
```

### <a name="sbAuthUnlink"></a> `$sbAuth.unlink(provider)`
Unlink social providers from a user profile.

#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| provider     | `String`      | String with the Providername, e.g. 'facebook' |

#### Returns
* __response__ the HTTP response object from the server

#### Usage

```javascript
$sbAuth.unlink('facebook')
  .then(function(response) {
    // Do something
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
  });
```

### <a name="sbAuthPassword"></a> `$sbAuth.password(newPassword,[oldPassword])`
Allows to update a users password or create one, if the user used social auth. You have to make sure to make necessary sanity checks for the new password (e.g. password repeat, password strength).

#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| newPassword  | `String`      | The new password |
| oldPassword (optional)  | `String`      | The existing password (only required if a password already exists) |

#### Returns
* __response__ the HTTP response object from the server

#### Usage

```javascript
$sbAuth.password('oldPassword', 'newPassword')
  .then(function(response) {
    // Do something
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
  });
```

### <a name="sbAuthLogout"></a> `$sbAuth.logout()`
Logs out the current user, removing the Token and the UserId from localStorage.

#### Usage
```javascript

$sbAuth.logout();
```

### <a name="sbAuthGetUserId"></a> `$sbAuth.getUserId()`
Returns the ID of the logged-in user for use e.g. in database querys.

#### Usage
```javascript

$sbAuth.getUserId();
```

## <a name="sbDatabase"></a> `$sbDatabase`
* [$sbDatabase.table(tableName)](#sbDatabaseTable)


### <a name="sbDatabaseTable"></a> `$sbDatabase.table(tableName)`
Select a table/collection you previously defined in the Admin Dashboard to run operations on it.

#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| tableName         | `String`      | Name of the table/collection you want to query|
#### Returns
* __$resource__ an Angular HTTP $resource object

#### Usage

Angulars <a href='https://docs.angularjs.org/api/ngResource/service/$resource' target='\_blank'>$resource</a> is a powerful to
manipulate data in the database in a REST-Style manner. Our API offers the
`get`
`save`
`update`
and
`delete` methods to retrieve and edit data in a specific table. In addition you can use sophisticated <a href='http://mongoosejs.com/docs/queries.html' target='\_blank'>Mogoose Querys</a> to retrieve exactly the data you need. Please read the linked docs to get a deeper understanding, as covering all the mechanics here is not possible. Despite, we provide a few examples to demonstrate what's possible.

```javascript
// Select the active database and bind the resource object to a variable
var todo = $sbDatabase.table('todo');

// retrieve all todos and bind them to the $scope
$scope.myTodos = todo.get();

// retrieve all todos and bind them to the $scope
// but this time also request meta data and deep-linked objects
$scope.myTodos = todo.get({ meta: true, deep: true});

// retrieve all todos and bind them to the $scope
// but this time apply a mongoose filter and
// sort descending (-) by occupation and ascending (+) by _id
$scope.myTodos = todo.get({
  filter: {
      occupation: 'host',
      age: {
          $gt: 17,
          $lt: 66
      },
      likes: {
          $in: ['vaporizing', 'talking']
      }
    },
  sort: '-occupation +_id'  
});

// save a todo object to the database
var newTodo = {
    title: 'Buy Milk',
    description: 'Please get fresh milk from Wholefoods'
}
todo.save(newTodo);

// use custom error and result handling
var newTodo = {
    title: 'Buy Milk',
    description: 'Please get fresh milk from Wholefoods'
}
todo.save(newTodo, function(res){
  //do something with the response
}, function(err) {
  //handle an error
});
```

## License

Copyright (c) 2016 Selfbits GmbH

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
