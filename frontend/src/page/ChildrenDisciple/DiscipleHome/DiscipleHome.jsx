import React from "react";
import Container from "../../../components/Container/Container";
import Instrument from "/img/instrument.png"
import Main from "../../../components/Main/Main";
import CartPageContainer from "../../../components/CartPageContainer/CartPageContainer";
import styles from './DiscipleHome.module.css'; // Создадим этот файл для стилей



function DiscipleHome() {
  const cartData = [
    {
      title: "Что такое наставничество и ученичество",
      link: "/disciple/nastavnichestvo-i-uchenichestvo",
      image: "/img/note.png",
    },
    {
      title: "Идентичность и ценности",
      link: "/disciple/identichnost",
      image: "/img/star.png",
    },
    {
      title: "Изучать Библию целиком",
      link: "/disciple/izuchenie-biblii",
      image: "/img/bible.png",
    },
    {
      title: `3 "П" ученичества`,
      link: "/disciple/3-p-uchenichestva",
      image: "/img/success.png",
    },
    {
      title: "Жизнь, подражание, поклонение",
      link: "/disciple/zhizn-i-poklonenie",
      image: "/img/face.png",
    },
    {
      title: "Новое рождение и новая жизнь",
      link: "/disciple/novoe-rozhdenie",
      image: "/img/road.png",
    },
    {
      title: "Анатомия наставничества",
      link: "/disciple/anatomiya-nastavnichestva",
      image: "/img/people.png",
    },
    {
      title: "Два вида наставничества",
      link: "/disciple/vidy-nastavnichestva",
      image: "/img/cube.png",
    },
  ];

  return (
    <>
      <Main img={Instrument} title={"Наставничество и ученичество"} description={"материалы для помощников, лидеров и руководителей"}/>
      <Container>
        <CartPageContainer cartData={cartData}/>
        <div className={styles.downloadsWrapper}>
          <h3 className={styles.downloadsTitle}>Документы для скачивания</h3>
          <a href="/downloads/Anketa.docx" className={styles.downloadButton} download>
            <span className={styles.buttonIcon}>📄</span>
            Анкета лидера-волонтера
          </a>
          <a href="/downloads/Ocenka.pdf" className={styles.downloadButton} download>
            <span className={styles.buttonIcon}>📊</span>
            Оценка клуба и служения
          </a>
          <a href="/downloads/Plan.docx" className={styles.downloadButton} download>
            <span className={styles.buttonIcon}>📅</span>
            Стратегический годовой план
          </a>
        </div>
      </Container>
    </>
  )
}

export default DiscipleHome;