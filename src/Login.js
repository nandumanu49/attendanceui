import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Logged in successfully with Google:', result.user.displayName);
        onLogin(result.user.displayName); // Call onLogin function with the user's display name
      })
      .catch((error) => {
        console.error('Google login error:', error);
      });
  };

  const handleEmailLogin = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Logged in successfully with email:', user.email);
        onLogin(user.email); // Call onLogin function with the user's email
      })
      .catch((error) => {
        console.error('Email login error:', error);
      });
  };

  const handleCreateAccount = () => {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Account created successfully with email:', user.email);
        onLogin(user.email); // Call onLogin function with the user's email
      })
      .catch((error) => {
        console.error('Create account error:', error);
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Login</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" placeholder="admin1@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" placeholder="abc123" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      </div>
      <button onClick={handleEmailLogin} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login with Email</button>
      <button onClick={handleCreateAccount} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create Account</button>
      <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login with Google</button>
    </div>
  );
}

export default Login;
