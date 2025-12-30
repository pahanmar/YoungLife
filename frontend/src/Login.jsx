import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // ожидаем, что login установит user в контексте
      await login(email, password);
      // после успешного логина возвращаем пользователя туда, откуда пришёл
      navigate(from, { replace: true });
    } catch (error) {
      // аккуратно извлекаем сообщение (в зависимости от реализации API)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : 'Ошибка входа');
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrap}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Введите данные для входа</p>

        <form className={styles.form} onSubmit={submit}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.primary}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Вхожу...' : 'Войти'}
            </button>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => navigate('/register')}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>

          {err && <div className={styles.error}>{err}</div>}
        </form>
      </div>

      <aside className={styles.aside}>
        <h3 className={styles.titleSmall}>Почему войти</h3>
        <p className={styles.subtitleSmall}>
          Доступ к личному кабинету, материалам и админ-панели.
        </p>
      </aside>
    </div>
  );
}