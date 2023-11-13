import './App.css';
import WebAuthnServerVerify from './WebAuthnServerVerify';
import WebAuthnPackage from './WebAuthnPackage';
import WebAuthnClientVerify from './WebAuthnClientVerify';

function App() {
  return (
    <div className="App">
      <h1>WebAuthn Fingerprint Authentication</h1>
      <p>Click the button below to login with your fingerprint.</p>
      <WebAuthnPackage />
      <WebAuthnServerVerify />
      <WebAuthnClientVerify />
    </div>
  );
}

export default App;
