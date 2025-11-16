import React from 'react';
import styles from './NewBirth.module.css'; // Создадим этот файл для стилей
import Container from "../../../components/Container/Container.jsx";
import imgMain from "/img/road.png"
import Main from "../../../components/Main/Main.jsx";


const NewBirth = () => {
  return (
    <>
        <Main img={imgMain} title={"Новое рождение и новая жизнь"} description={"как евангелизация и наставничество пересекаются"}/>
        <Container>
        <div className={styles.container}>
          <div className={styles.section}>
              <h2 className={styles.mainTitle}>Евангелизация и наставничество: неразрывное единство</h2>
              
              <div className={styles.content}>
                  <p className={styles.leadText}>
                      Евангелизация и наставничество - об одном и том же: люди встречаются со Христом, 
                      узнают Его и следуют за Ним. Евангелизация ведёт к новому рождению, а наставничество 
                      к новой жизни, но они оба о том, что человек идёт живёт вместе со Христом и для 
                      Христа как часть Его нового творения. Эти два понятия нельзя понимать раздельно.
                  </p>
                  
                  <div className={styles.highlightBlock}>
                      <p className={styles.highlightText}>
                          Мы никогда не прекращаем говорить Евангелие и не уходим от провозглашения Его 
                          любви и приглашения в Его присутствие. Мы просто расширяем это понятие, чтобы 
                          включить в него больше знания и понимания Христа.
                      </p>
                  </div>
                  
                  <p className={styles.text}>
                      Точно также, как нет финишной черты для проповеди Евангелия, нет и "подходящего 
                      момента" для начала наставничества. Мы не можем ждать, пока кто-то "точно начнёт 
                      следовать за Христом". Если наставничество помогает другим стать более похожими на 
                      Христа, то это значит, что оно может начаться задолго до того, как человек вообще 
                      заинтересуется Христом.
                  </p>
                  
                  <p className={styles.text}>
                      То, как он живёт, говорит и взаимодействует с другими может тоже быть подражанием 
                      Христу, осознаёт это человек или нет. Твои слова о Христе также учат людей тому, 
                      что значит следовать за Ним и жить для Него. И если (или когда) кто-то отдаёт себя 
                      Христу, все ваши прежние диалоги и взаимодействия остаются с ним в его новой жизни.
                  </p>
                  
                  <h3 className={styles.subTitle}>Евангелизация и наставничество это:</h3>
                  
                  <ul className={styles.featuresList}>
                      <li className={styles.featureItem}>
                          <span className={styles.featureIcon}>→</span>
                          <div className={styles.featureContent}>
                              <strong>Включаться в мир других</strong>, не важно - в 1-й или 31-й раз; 
                              это требует смелости и понимания своих обязательств.
                          </div>
                      </li>
                      <li className={styles.featureItem}>
                          <span className={styles.featureIcon}>→</span>
                          <div className={styles.featureContent}>
                              <strong>Строить доверительные отношения</strong>, не важно - с новым знакомым 
                              или очень давним другом; это требует постоянности и понимания.
                          </div>
                      </li>
                      <li className={styles.featureItem}>
                          <span className={styles.featureIcon}>→</span>
                          <div className={styles.featureContent}>
                              <strong>Проповедовать Благую Весть о Христе</strong>, не важно - в виде 
                              чего-то простого или в виде глубокого диалога о Христе и послушании; 
                              это требует честности и упорства.
                          </div>
                      </li>
                  </ul>
                  
                  <div className={styles.conclusionBlock}>
                      <p className={styles.conclusionText}>
                          Евангелизация и наставничество - это не два разных пути. Говоря Благую Весть, 
                          мы также и наставляем других. Наставляя других, мы также говорим Благую Весть. 
                          Форма может немного меняться, но цель - нет.
                      </p>
                  </div>
              </div>
              
              <div className={styles.discussionSection}>
                  <h3 className={styles.discussionTitle}>Вопросы для обсуждения:</h3>
                  <ul className={styles.discussionList}>
                      <li className={styles.discussionItem}>
                          Как ты раньше понимал евангелизацию и наставничество?
                      </li>
                      <li className={styles.discussionItem}>
                          Если кто-то спросит: "ты больше евангелист или наставник?", - что ты ответишь?
                      </li>
                      <li className={styles.discussionItem}>
                          Как понимание евангелизации и наставничества как единого целого может помочь 
                          тебе в твоём служении?
                      </li>
                  </ul>
              </div>
          </div>
      </div>
        </Container>
    </>
  );
};

export default NewBirth;