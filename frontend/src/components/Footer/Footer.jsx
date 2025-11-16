import React from 'react';
import styles from './Footer.module.css'; // Создадим этот файл для стилей
import Container from "../Container/Container.jsx";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <Container>
            <div className={styles.footerContent}>
                <Link to="/">
                    <img src="/img/footer_logo.png" className={styles.logo} />
                </Link>
                <p className={styles.footerResourse}>Ресурсы для тех, кто помогает стать другим похожими на Христа.</p>
                <div className={styles.footerLinkWrapper}>
                    <h3 className={styles.footerLinkTitle}>СВЯЗАТЬСЯ С НАМИ</h3>
                    <p className={styles.footerLinkDescription}>Есть идеи, предложения или вопросы? Напиши нам:</p>
                    <a href="mailto:tim.russiayl@yandex.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>НАША ПОЧТА</a>
                </div>
            </div>
        </Container>
    </footer>
  );
};

export default Footer;