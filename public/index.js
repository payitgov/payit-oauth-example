"use strict";
window.PayItLogin = function () {
    let callbackUri = window.location.origin + '/callback';
    PayitOauth.PayitOauthUI.authenticate(payItClientId, callbackUri, 'development', ['everything'], { MyData: { 'abc': 123, time: Date.now() } });
};

window.LogOut = function () {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        // Logout from PayIt IDP
        if (typeof PayitOauth !== 'undefined' && PayitOauth.PayitOauthUI && typeof PayitOauth.PayitOauthUI.logout === 'function') {
            PayitOauth.PayitOauthUI.logout(payItClientId, window.location.origin + '/', 'development');
        } else {
            window.location.href = '/';
        }
    });
}
