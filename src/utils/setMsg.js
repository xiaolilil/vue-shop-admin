function setToken(str, token) {
    if (getToken.token) {
        return false;
    } else {
        window.sessionStorage.setItem(str, token);
        return true;
    }
}
function getToken(params) {
    return window.sessionStorage.getItem(params)
}
function removeToken() {
    window.sessionStorage.clear();
}

export {
    setToken,
    getToken,
    removeToken,
}
