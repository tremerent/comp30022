import jwt from 'jsonwebtoken';

const identityConnectDetails = {
    grant_type: 'password',
    client_id: 'artefactor-react',
    client_secret: 'secret',
    scope: 'artefactorapi',
}

function getAuthDetails() {
    const authDetails = JSON.parse(
        localStorage.getItem("userAuth")
    );

    return authDetails;
}

// loginDetails: { username, password }
async function setUser(loginDetails) {
    try {
        const tokenResp = await postTokenReq(loginDetails);

        const exp = getTokenPayload(tokenResp.access_token).exp;

        const authDetails = {
            token: tokenResp.access_token,
            // js expects ms since epoch, but jwt is seconds
            expiry: new Date(parseInt(exp) * 1000),  
            user: {
                username: loginDetails.username,
            },
        };

        localStorage.setItem("userAuth", JSON.stringify(authDetails));

        return authDetails;
    }
    catch (e) {
        console.error(e);
    }

    return false;
}

function getTokenPayload(token) {
    return jwt.decode(token);
}

function isExpired(expiry) {
    if ((typeof expiry) === 'string') {
        expiry = Date.parse(expiry);
    }

    return Date.now() > expiry;
}

function logoutUser() {
    localStorage.removeItem("userAuth");
}

async function postTokenReq(loginDetails) {
    const resp = await fetch('/connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            ...identityConnectDetails,
            username: loginDetails.username,
            password: loginDetails.password,
        }),
    });

    return await resp.json();
}

function getToken() {
    const curUserAuth = JSON.parse(
        localStorage.getItem("userAuth")
    );

    if (curUserAuth) {
        return curUserAuth.token;
    }

    return null;
}

export {
    getAuthDetails,
    setUser,
    logoutUser,
    getToken,
    isExpired,
}