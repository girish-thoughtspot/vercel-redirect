import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNextClick = () => {
    // Handle next button click here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Login Form</label>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        style={styles.input}
      />
      <button style={styles.button} onClick={handleNextClick}>Next</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
    margin: '0 auto',
  },
  label: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    width: '100px',
  },
  button: {
    padding: '10px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default LoginForm;
