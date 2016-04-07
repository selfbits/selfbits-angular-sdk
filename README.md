# selfbits-angular-sdk

This package allows you to easily integrate the Selfbits Backend-as-Service into your Angular based project. Please note that you MUST have a Selfbits BaaS Account and an active Project to use the service. Check out http://baas.selfbits.org for more info.

## Installation

```
# Bower
bower install selfbits-angular-sdk
```

Include the script:

```html
<html>
    <head>
        ... other files
        <!-- Load SDK --> 
        <script src="bower_components/dist/selfbits-angular.min.js"></script>
    </head>
    <body>
    
    </body>
</html>
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

## `$sbAuth`
*$sbAuth.login(user)
*$sbAuth.signup(user)
*$sbAuth.social(provider)
*$sbAuth.unlink(provider)

### <a name="login"></a> `sbAuth.login(user)`
Sign in using email and password:
#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| user         | `Object`      | JavaScript object containing user information |
#### Returns
*__response__ the HTTP response object from the server
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

### `sbAuth.signup(user)`
Sign up using email and password. You have to make sure to make neccessary sanity checks (e.g. password repeat, password strength).
#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| user         | `Object`      | JavaScript object containing user information |
#### Returns
*__response__ the HTTP response object from the server
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

### `sbAuth.social(provider)`
Sign in **OR** up using social providers. Opens a popup window, that leads the user through the social auth flow.
#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| provider     | `String`      | String with the Providername, e.g. 'facebook' |
#### Returns
*__response__ the HTTP response object from the server
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

### `sbAuth.unlink(provider)`
Unlink social providers from a user profile.
#### Parameters
| Param        | Type          | Details  |
| -------------|:-------------:| -----:|
| provider     | `String`      | String with the Providername, e.g. 'facebook' |
#### Returns
*__response__ the HTTP response object from the server
#### Usage
```javascript
$sbAuth.unlink('facebook')
  .then(function(response) {
    // Redirect user here after a successful log in.
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
    // for invalid email and/or password.
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