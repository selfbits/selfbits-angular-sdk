# selfbits-angular-sdk

This package allows you to easily integrate the Selfbits Backend-as-Service into your Angular based project.

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