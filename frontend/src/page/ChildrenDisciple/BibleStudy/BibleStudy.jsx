import React from 'react';
import styles from './BibleStudy.module.css'; // Создадим этот файл для стилей
import Container from "../../../components/Container/Container.jsx";
import imgMain from "/img/bible.png"
import Main from "../../../components/Main/Main.jsx";


const BibleStudy = () => {
  return (
    <>
        <Main img={imgMain} title={"Изучать Библию целиком"} description={"чтобы видеть полную историю"}/>
        <Container>
        <div className={styles.container}>
          <div className={styles.section}>
              <h2 className={styles.mainTitle}>Важность глубокого знания Библии в наставничестве</h2>
              
              <div className={styles.content}>
                  <p className={styles.leadText}>Люди, занимающиеся наставничеством, должны знать Библию гораздо глубже и лучше, чем просто помнить пару отрывков из Нового Завета.</p>
                  
                  <h3 className={styles.reasonsTitle}>Три причины:</h3>
                  <ol className={styles.reasonsList}>
                      <li className={styles.reasonItem}>
                          <strong>Контекст общей истории</strong>
                          <p>Маленькие отрывки всегда раскрывают контекст общей истории. Вне этого контекста, такие отрывки очень легко понять и интерпретировать неправильно.</p>
                      </li>
                      <li className={styles.reasonItem}>
                          <strong>Пример Иисуса</strong>
                          <p>Иисус знал, читал, изучал и учил то, что мы сейчас называем Ветхим Заветом. Это было Библией для Христа и с Его приходом никуда не делось. Мы повторяем за Иисусом, поэтому читаем и изучаем Ветхий Завет в контексте большой истории о жертве Христа, воскресении и вечной жизни.</p>
                      </li>
                      <li className={styles.reasonItem}>
                          <strong>История Христа от Бытия</strong>
                          <p>История Христа начинается в Бытие 1:1. Согласно Библии - через Него всё начало быть, и Он был в начале. Он обещанный Мессия и Царь из рода Давида, о котором говорили пророки. Многие элементы Нового Завета раскрывают себя полностью только когда мы читаем и вникаем в Ветхий Завет.</p>
                      </li>
                  </ol>
                  
                  <div className={styles.conclusion}>
                      <p className={styles.text}>Когда кто-то растёт в ученичестве, он также должен расти в своём знании Библии: как заново читать то, что он уже слышал, так и открывать для себя новые места Писания.</p>
                  </div>
                  
                  <h3 className={styles.subTitle}>Способы включить молодых верующих в изучение Ветхого Завета</h3>
              </div>
              
              <div className={styles.discussionSection}>
                  <h3 className={styles.discussionTitle}>Вопросы для рассуждения:</h3>
                  <ul className={styles.discussionList}>
                      <li className={styles.discussionItem}>Насколько сейчас ты знаком с полной историей описанной в Библии?</li>
                      <li className={styles.discussionItem}>С какими частями Писания ты знаком слабее всего? Как ты можешь начать их изучение?</li>
                      <li className={styles.discussionItem}>На какие части Библии ты НЕ смотришь в своём наставничестве? Почему?</li>
                      <li className={styles.discussionItem}>Есть ли у тебя примеры, как более глубокое понимание Библии помогало лучше понять известные или уже знакомые отрывки?</li>
                  </ul>
              </div>
          </div>
      </div>
        </Container>
    </>
  );
};

export default BibleStudy;