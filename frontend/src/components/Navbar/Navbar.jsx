import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import Container from "../Container/Container.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.whiteNavbar}>
      <Container>
      <nav className={`${styles.navbar}`}>
        <Link to="/">
        <img src="/img/logo.png" className={styles.logo} />
        </Link>
        <button 
          className={`${styles.burgerButton} ${isOpen ? styles.fixed : ""}`}
          onClick={toggleMenu}
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isOpen}
        >
          <div className={`${styles.burgerLine} ${isOpen ? styles.line1Open : ""}`}></div>
          <div className={`${styles.burgerLine} ${isOpen ? styles.line2Open : ""}`}></div>
          <div className={`${styles.burgerLine} ${isOpen ? styles.line3Open : ""}`}></div>
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
          </ul>
        </div>
      </nav>
      </Container>
    </div>


  );
};

export default Navbar;