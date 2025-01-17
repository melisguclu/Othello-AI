import React from 'react';
import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

export default function Login() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '300px',
    },
    label: {
      marginBottom: '5px',
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#333',
    },
    input: {
      marginBottom: '15px',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      outline: 'none',
    },
    button: {
      padding: '10px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    header: {
      marginBottom: '20px',
      color: '#333',
    },
  };

  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const { setUser } = useContext(UserContext);

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setUser(response.data.user); // Update the user context immediately
        setData({ email: '', password: '' });
        toast.success(response.data.message);
        // navigate('/');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data.error || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>LOgin</h1>
      <form style={styles.form} onSubmit={loginUser}>
        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          style={styles.input}
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          style={styles.input}
          type="password"
          id="password"
          name="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button
          style={styles.button}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor =
              styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
