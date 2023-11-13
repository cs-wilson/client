import React from 'react';
import * as cbor from 'cbor-js';

const randomStringFromServer = "a7c61ef9-dc23-4806-b486-2428938a547e";

// 注册
async function handleRegister() {
    const credential = await navigator.credentials.create({
        publicKey: {
            challenge: Uint8Array.from(
                randomStringFromServer, c => c.charCodeAt(0)),
            rp: { // rp: Relying Party
                id: 'localhost',
                name: 'WebAuthn Demo',
            },
            user: { // user: User Account
                id: new Uint8Array([79, 252, 83, 72, 214, 7, 89, 26]),
                name: 'wilson Lee',
                displayName: 'wilson',
            },
            pubKeyCredParams: [
                { type: 'public-key', alg: -7 }, // ES256
            ],
            authenticatorSelection: {
                userVerification: 'discouraged',
            },
            attestation: 'direct',
        }
    });

    console.log("register credential", credential)
    console.log("credential response", credential.response.attestationObject)
    const attestationObjectBase64 = btoa(
        String.fromCharCode.apply(null, new Uint8Array(credential.response.attestationObject))
    );
    console.log('凭据响应', attestationObjectBase64);

    // 解码Base64字符串为ArrayBuffer
    const attestationObjectArrayBuffer = Uint8Array.from(atob(attestationObjectBase64), c => c.charCodeAt(0)).buffer;
    console.log('解码后的attestationObjectArrayBuffer', attestationObjectArrayBuffer)

    // 解析CBOR数据
    const attestationObject = cbor.decode(attestationObjectArrayBuffer);
    console.log('解析后的attestationObject', attestationObject);

    // 保存凭证ID
    localStorage.setItem('credentialId', credential.rawId);

    if (localStorage.getItem('credentialId')) {
        console.log(localStorage.getItem('credentialId'));

        console.log('注册成功！');
    }

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

}


const WebAuthnClientVerify = () => {
    return (
        <div>
            <h1>WebAuthnClientVerify</h1>
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default WebAuthnClientVerify;