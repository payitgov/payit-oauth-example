"use strict";
window.PayItLogin = function () {
    let callbackUri = window.location.origin + '/callback';
    PayitOauth.PayitOauthUI.authenticate(payItClientId, callbackUri, 'development', ['everything'], { MyData: { 'abc': 123, time: Date.now() } });
};

window.LogOut = function () {
    // Step 1: Clear our application's login session first
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(() => {
        // Step 2: After session is cleared, logout from PayIt IDP (this will redirect)
        if (typeof PayitOauth !== 'undefined' && PayitOauth.PayitOauthUI && typeof PayitOauth.PayitOauthUI.logout === 'function') {
            PayitOauth.PayitOauthUI.logout(payItClientId, window.location.origin + '/', 'development');
        } else {
            window.location.href = '/';
        }
    }).catch(error => {
        console.error('Logout error:', error);
        // Fallback redirect to home page
        window.location.href = '/';
    });
}
