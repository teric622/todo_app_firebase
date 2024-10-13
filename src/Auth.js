import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import Todo from './Todo';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert("Error signing up: " + error.message);
    }
  };

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <div>
      {!user ? ( // Only render sign-up/login form if there is no user
        <div>
          <h2>Sign Up / Log In</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={signUp}>Sign Up</button>
          <button onClick={logIn}>Log In</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={logOut}>Log Out</button>
          <Todo user={user} /> {/* Pass user to Todo component only when logged in */}
        </div>
      )}
    </div>
  );
};

export default Auth;
