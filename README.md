# Payit oAuth Example

This example application demonstrates how you might inrgtate PayIt Auth into you application to sllow your users to authenticate with their PayIt credentials.

## How to use this repository

1. If you do not have a Client ID and Client Secret please contact productteam@payitgov.com. Once you do have a Client ID and Client Secret add a `.env` file and add them as variables in the file. For example:
    ```
    PAYIT_CLIENT_ID=<client id>
    PAYIT_CLIENT_SECRET=<client secret>

2. Next we recommend running `nvm use` to ensure you are working with the correct version of node.
3. Run `npm install` to install the necessary dependencies.
4. Finally run `npm run start`
5. The application should be available at http://localhost:8080


## Overall oAuth Configuration 

To utilize PayIt Oauth You need to contact us at productteam@payitgov.com for new client registration.

#### Provide us:
  A list of redirect uris. All the possible redirection entrypoints to which we should return the user.

#### We will provide you:
   * A Client ID
   * A Client Secret

The Client Secret should be kept in a secure location.

## Implementing PayIt Oauth

Implementing PayIt Oauth is a two step process:
  * Invoke PayItOauthUI.authenticate()
  * Exchange your code for a PayIt JWT

### Invoke PayitOAuthUI.authenticate()

 The first step in the Oauth process is to send your user to the PayIt Login flow, you can do this immediately when you detect a user does not have a session, when they ask to login, or when they click a Login with PayIt Oauth Button.

 #### Obtaining the PayIt Oauth SDK
 You have the option of obtaining the PayIt Oauth SDK via npm or via a ready to use javascript file which makes the methods available on the window unit.


 ##### npm install payit-oauth-sdk
 You will need this anyway in your backend for step 2 (token exchange) and if you already have a large UI application that bundles npm dependencies this is the way to go.

 ```bash
 npm install payit-oauth-sdk --save
 ```

 ```javascript
 import { PayitOauthUI } from 'payit-oauth-sdk';

 PayitOauthUI.authenticate(CLIENT_ID, REDIRECT_URI);
 ```

 ##### Using PayIt Oauth SDK via CDN URL

 This option is provided for UIs that are not complex and do not bundle javascript dependencies. In this case it is simpler to include the sdk in the necessary html file and use the methods as global variables.

> NOTE: When using the CDN script classes are namespaced under PayitOauth as in the example below
 ```html
<body>
<script src="https://d3ck169wa5xhu5.cloudfront.net/oauth/payit-oauth-sdk.umd.js"></script>
<script>
    PayitOauth.PayitOauthUI.authenticate(CLIENT_ID, REDIRECT_URI);
</script>
 ```

#### Providing Configuration Variables
The sdk method authenticate can only be invoked from a browser because its purpose is to redirect the browser with certain configurations you provide. So you need to provide your UI code these two data points

* Client ID: This variable is safe to pass to the browser, and it must be passed to be provided to authenticate(). However never provide the Client Secret to the browser.

* REDIRECT_URI: This is the URL in which you wish for your application to recieve back control. This endpoint should also accept a code query parameter and will implement the token logic as explained in this guide.

### Exchange your code for a PayIt JWT

The second and final step in authenticating with PayIt Oauth is to receive back control at your provided redirect_uri and use the method PayitOauthServer.getToken to exchange code you recieved as a query parameter for the PayIt JWT.

#### Invoking getToken()

This operation should be done only on the back end. To get the token you must provide your client secret, which should never be sent to the UI.

```typescript
PayitOauthServer.getToken(
    ClientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string
): Promise<string>
```

* Client ID: This is the same string that you used to call authenticate().

* Client Secret: This is the secret that pairs with your Client ID you should provide this to your server via an environment variable or fetch it securely from the database, do not check it into your code.

* Code: This will be provided via a query param to your redirect_uri.
   ```
   /callback?code=3456234
   ```
   On its own the code does not provide anything but it is valid for 30 seconds to be exchanged for a token provided the other arguments are correct.

* Redirect URI: This must be the same redirect URI that was provided to the autheticate() method it is associated with your code and must match. The strings must match perfectly so ensure there are no extra segments or query parameters. 

