"use strict";
window.PayItLogin = function () {
    let callbackUri = window.location.origin + '/callback';
    PayitOauth.PayitOauthUI.authenticate(window.payItClientId, callbackUri, 'development', ['everything'], { MyData: { 'abc': 123, time: Date.now() } });
};

window.LogOut = function () {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        window.location.href = '/';
    });
}
