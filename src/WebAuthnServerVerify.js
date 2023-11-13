import React from 'react';

const randomStringFromServer = "a7c61ef9-dc23-4806-b486-2428938a547e";

// 注册
async function handleRegister() {
    const credential = await navigator.credentials.create({
        publicKey: {
            challenge: Uint8Array.from(
                randomStringFromServer, c => c.charCodeAt(0)),
            rp: {
                id: 'localhost',
                name: 'WebAuthn Demo',
            },
            user: {
                id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
                name: 'wilson Lee',
                displayName: 'wilson',
            },
            pubKeyCredParams: [
                { type: 'public-key', alg: -7 }, // ES256
            ],
            authenticatorSelection: {
                // userVerification: 'discouraged',
                // userVerification: 'required',
                userVerification: 'preferred',
            },
            attestation: 'direct',
        }
    });

    console.log("register credential", credential)

    // 保存凭证ID
    localStorage.setItem('credentialId', credential.rawId);

    if (localStorage.getItem('credentialId')) {

        console.log('注册成功！');
    }

    // const registerData = {
    //     id: credential.id,
    //     rawId: uint8ArrayToBase64(credential.rawId),
    //     type: credential.type,
    //     response: {
    //         attestationObject: arrayBufferToBase64(credential.response.attestationObject),
    //         clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
    //     },
    // };
    // const response = await fetch('http://localhost:3001/register', {
    //     method: 'POST',
    //     body: JSON.stringify(registerData),
    //     headers: { 'Content-Type': 'application/json' },
    // });

    // if (response.ok) {
    //     console.log('注册成功！');
    // } else {
    //     console.error('注册失败：', response.status);
    // }
}

// 登录
async function handleLogin() {
    const credentialId = localStorage.getItem('credentialId');
    const credentialIdBytes = new TextEncoder().encode(credentialId);

    const assertion = await navigator.credentials.get({
        publicKey: {
            challenge: Uint8Array.from(
                randomStringFromServer, c => c.charCodeAt(0)),
            rpId: 'localhost',
            allowCredentials: [
                {
                    type: 'public-key',
                    id: credentialIdBytes,
                    transports: ['internal'],
                },
            ],
            userVerification: 'discouraged',
        }
    });

    console.log("login assertion", assertion)


    // const response = await fetch('http://localhost:3001/login', {
    //     method: 'POST',
    //     body: JSON.stringify(assertion),
    //     headers: { 'Content-Type': 'application/json' },
    // });

    // if (response.ok) {
    //     console.log('登录成功！');
    // } else {
    //     console.error('登录失败：', response.status);
    // }
}

// function arrayBufferToBase64(buffer) {
//     const binary = [];
//     const bytes = new Uint8Array(buffer);
//     const len = bytes.byteLength;
//     for (let i = 0; i < len; i++) {
//         binary.push(String.fromCharCode(bytes[i]));
//     }
//     return window.btoa(binary.join(''));
// }

// function uint8ArrayToBase64(uint8Array) {
//     let binary = '';
//     const len = uint8Array.byteLength;
//     for (let i = 0; i < len; i++) {
//         binary += String.fromCharCode(uint8Array[i]);
//     }
//     return window.btoa(binary);
// }


const WebAuthnServerVerify = () => {
    return (
        <div>
            <h1>WebAuthnServerVerify</h1>
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default WebAuthnServerVerify;