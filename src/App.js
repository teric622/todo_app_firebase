import React from 'react';
import { AuthProvider, AuthContext } from './AuthContext'; // Import AuthContext
import Auth from './Auth'; // Component for sign in/sign up
import Todo from './Todo'; // Your todo component

const App = () => {
  const { user, logout } = React.useContext(AuthContext); // Access the user and logout function from AuthContext

  return (
    <AuthProvider>
      <div>
        {user ? (
          <div>
            <h1>Welcome, {user.email}</h1>
            <button onClick={logout}>Log Out</button>
            <Todo user={user} />
          </div>
        ) : (
          <Auth /> // Show the Auth component if user is not logged in
        )}
      </div>
    </AuthProvider>
  );
};

export default App;
