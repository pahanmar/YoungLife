import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Container from "../Container/Container.jsx";
import { useAuth } from "../../context/AuthContext.jsx"; // проверьте относительный путь

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/"); // редирект на главную после выхода
    } catch (e) {
      console.error("Logout failed", e);
      // Можно показать уведомление пользователю
    }
  };

  return (
    <div className={styles.whiteNavbar}>
      <Container>
        <nav className={`${styles.navbar}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src="/img/logo.png" className={styles.logo} alt="logo" />
          </Link>

          <button
            className={`${styles.burgerButton} ${isOpen ? styles.fixed : ""}`}
            onClick={toggleMenu}
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isOpen}
          >
            <div className={`${styles.burgerLine} ${isOpen ? styles.line1Open : ""}`} />
            <div className={`${styles.burgerLine} ${isOpen ? styles.line2Open : ""}`} />
            <div className={`${styles.burgerLine} ${isOpen ? styles.line3Open : ""}`} />
          </button>

          <div className={`${styles.navMenu} ${isOpen ? styles.open : ""}`}>
            <ul>
              <li>
                <Link to="/" onClick={() => setIsOpen(false)}>Главная</Link>
              </li>
              <li>
                <Link to="/books" onClick={() => setIsOpen(false)}>Книги</Link>
              </li>
              <li>
                <Link to="/disciple" onClick={() => setIsOpen(false)}>Наставничество и ученичество</Link>
              </li>

              {/* Если пользователь залогинен — показываем кнопку выхода */}
              {user ? (
                <li>
                  <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                    aria-label="Выйти из аккаунта"
                  >
                    Выйти
                  </button>
                </li>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setIsOpen(false)}>Войти</Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;