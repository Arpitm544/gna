import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const msg = localStorage.getItem('successMessage');
    if (msg) {
      setMessage(msg);
      localStorage.removeItem('successMessage'); 
    }
  }, []);
 
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
     
        <h2>{message||'Welcome to the Home Page!'}</h2>
      </div>
  );
}