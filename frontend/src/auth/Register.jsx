import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Register() {
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
    name: '',
    email: '',
    password: '',
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;
    try {
      const { data } = await axios.post('/auth/register', {
        name,
        email,
        password,
      });
      if (data.error) {
        return toast.error(data.error);
      } else {
        setData({});
        toast.success('Login Successful');
        navigate('/login');
      }
    } catch (error) {
      console.error(error.response?.data || 'Something went wrong');
      toast.error('Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Register</h1>
      <form style={styles.form} onSubmit={registerUser}>
        <label style={styles.label} htmlFor="name">
          name
        </label>
        <input
          style={styles.input}
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={(e) =>
            setData({ ...data, [e.target.name]: e.target.value })
          }
        />
        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          style={styles.input}
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={(e) =>
            setData({ ...data, [e.target.name]: e.target.value })
          }
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
          onChange={(e) =>
            setData({ ...data, [e.target.name]: e.target.value })
          }
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
          Register
        </button>
      </form>
    </div>
  );
}
