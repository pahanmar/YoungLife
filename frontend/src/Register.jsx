import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import styles from './Register.module.css';

export default function Register() {
  const auth = useAuth();
  console.log('auth ctx', auth);
  const register = auth?.register;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    console.log('submit fired', { name, email, password });
    try {
      if (!register) throw new Error('register function not available in AuthContext');
      const res = await register({ name, email, password });
      console.log('register result', res);
      // если сервер вернул ошибку в структуре -> выбросим
      if (res?.error || res?.message && !res.user && !res.accessToken) {
        throw new Error(res.message || 'Registration failed');
      }
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('register error', error);
      setErr(error.response?.data?.message || error.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrap}>
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Создайте аккаунт</p>

        <form className={styles.form} onSubmit={submit}>
          <input className={styles.input} placeholder="Имя" value={name} onChange={e => setName(e.target.value)} required />
          <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className={styles.input} type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />

          <div className={styles.actions}>
            <button className={`${styles.btn} ${styles.primary}`} type="submit" disabled={loading}>
              {loading ? 'Создаём...' : 'Зарегистрироваться'}
            </button>
          </div>

          {err && <div className={styles.error}>{err}</div>}
        </form>
      </div>

      <aside className={styles.aside}>
        <h3 className={styles.titleSmall}>Добро пожаловать</h3>
        <p className={styles.subtitleSmall}>После регистрации вы сможете войти в систему.</p>
      </aside>
    </div>
  );
}