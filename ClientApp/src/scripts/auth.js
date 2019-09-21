
const identityConnectDetails = {
    grant_type: 'password',
    client_id: 'artefactor-react',
    client_secret: 'secret',
    scope: 'artefactorapi',
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

function getCurUser() {
    const authDetails = JSON.parse(
        localStorage.getItem("authDetails")
    );

    console.log(authDetails);

    if (authDetails) {
        return authDetails.user;
    }
    else {
        return null;
    }
}

// loginDetails: { username, password }
async function setUser(loginDetails) {
    console.log('hello')
    try {
        const tokenResp = await postTokenReq(loginDetails);

        const authDetails = {
            token: tokenResp.access_token,
            expiry: tokenResp.expires_in,
            username: loginDetails.username,
        };

        localStorage.setItem("authDetails", JSON.stringify(authDetails));
    }
    catch (e) {
        console.error(e);
    }

    return true;
}

export {
    getCurUser,
    setUser,

}