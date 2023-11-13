import React from 'react';
import { client, server } from '@passwordless-id/webauthn'
import { parsers } from '@passwordless-id/webauthn'

console.log("client isAvailable", await client.isAvailable())
const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e"
const hostname = window.location.hostname; // localhost
console.log("hostname", hostname);
const username = "wilson22"

const handleExisted = async () => {
    const response = await client.isLocalAuthenticator()
    uiConsole("isLocalAuthenticator", response);
}


const callFingerAuth = async () => {
    const registration = await client.register(username, challenge, {
        authenticatorType: "both",
        userVerification: "required",
        timeout: 60000,
        attestation: false,
        userHandle: username,
        debug: false,
        origin: "http://localhost:3000"
    })

    return registration;
}

const mockVerifyFingerAuth = async (registration) => {
    const expected = {
        challenge: "a7c61ef9-dc23-4806-b486-2428938a547e",
        origin: "http://localhost:3000",
    }
    const registrationParsed = await server.verifyRegistration(registration, expected);
    console.log("registrationParsed", registrationParsed);
    uiConsole("registrationParsed", registrationParsed);
    localStorage.setItem("credentialID", registrationParsed.credential.id);
    if(localStorage.getItem("credentialID")) {
        console.log("credentialID", localStorage.getItem("credentialID"));
    }
}


const handleRegister = async () => {
    const registration = await callFingerAuth();
    console.log("registration", registration);
    // uiConsole("registration", registration);
    // await mockVerifyFingerAuth(registration);

    const result = await parsers.parseRegistration(registration);
    // console.log("result", result);
    uiConsole("result", result);

}
const handleLogin = async () => {
    const credentialID = localStorage.getItem("credentialID");
    // const credentialId = credential.id;
    console.log("credentialId", credentialID);
    const authentication = await client.authenticate([credentialID], challenge, {
        "authenticatorType": "auto",
        "userVerification": "required",
        "timeout": 60000
      })
    console.log("authentication", authentication);
    uiConsole("authentication", authentication);

    // const parsedData = await parsers.parseAuthentication(authentication);
    // console.log("parsedData", parsedData);
    // uiConsole("parsedData", parsedData);
}


const uiConsole = (...args) => {
    const el = document.querySelector("#console>p");
    if (el) {
        el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
};

const WebAuthnPackage = () => {
    return (
        <div>
            <button onClick={handleExisted}>WebAuthn isAvailable</button>
            <button onClick={handleRegister}>register</button>
            <button onClick={handleLogin}>login</button>
            <div id="console" style={{ whiteSpace: "pre-line" }}>
                <p style={{ whiteSpace: "pre-line" }}></p>
            </div>
        </div>
    );
}

export default WebAuthnPackage;