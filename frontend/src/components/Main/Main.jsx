import React from 'react';
import styles from './Main.module.css'; // Создадим этот файл для стилей
import Container from "../Container/Container.jsx";

const Main = ({img, title, description}) => {
  return (
    <main className={styles.main}>
        <Container>
          <div className={styles.titleWrapper}>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.titleDescription}>{description}</p>
            </div>
            <div className={styles.mainImgContainer}>
              <img src={img} className={styles.mainImg}/>
            </div>
          </div>
        </Container>
      </main>
  );
};

export default Main;