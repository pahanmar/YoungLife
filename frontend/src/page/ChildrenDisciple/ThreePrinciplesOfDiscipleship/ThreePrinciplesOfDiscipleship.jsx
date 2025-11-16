import React from 'react';
import styles from './ThreePrinciplesOfDiscipleship.module.css'; // Создадим этот файл для стилей
import Container from "../../../components/Container/Container.jsx";
import imgMain from "/img/success.png"
import Main from "../../../components/Main/Main.jsx";


const ThreePrinciplesOfDiscipleship = () => {
  return (
    <>
        <Main img={imgMain} title={`3 "П" ученичества`} description={"призвание, план, подготовка"}/>
        <Container>
        <div className={styles.container}>
          <div className={styles.section}>
              <h2 className={styles.mainTitle}>Формирование эффективного наставничества</h2>
              
              <div className={styles.intro}>
                  <p className={styles.introText}>Эти вещи помогут тебе сформулировать твоё наставничество и понять, куда двигаться дальше:</p>
              </div>
              
              <div className={styles.strategySection}>
                  <div className={styles.strategyBlock}>
                      <div className={styles.strategyHeader}>
                          <span className={styles.strategyNumber}>1</span>
                          <h3 className={styles.strategyTitle}>Призвание (вечное)</h3>
                      </div>
                      <div className={styles.strategyContent}>
                          <p className={styles.text}>Наше главное призвание в наставничестве - это помогать другим стать более похожими на Христа. Всё, что мы делаем, направлено именно на это. Раскрытие этого понятия поможет тебе определить, что ты будешь делать и почему.</p>
                          
                          <p className={styles.text}>Самые очевидные вещи, которые приходят нам в голову, это совместное чтение Писания, совместная молитва, общение на важные и актуальные темы и подача хорошего примера ученичества через твою собственную жизнь.</p>
                          
                          <div className={styles.focusBlock}>
                              <h4 className={styles.focusTitle}>Фокус наставничества:</h4>
                              <p className={styles.focusText}>Будет полезным определить одну цель или результат, на котором ты хочешь сейчас сфокусироваться. С каким убеждением, осознанием и практикой ты хочешь отпустить своих учеников, когда им нужно будет двигаться дальше?</p>
                              <p className={styles.focusText}>Большинство фокусируется на Библии. Они хотят, чтобы их ученики верили, что Писание заслуживает доверия и его нужно внимательного слушать, и чтобы им было проще извлекать оттуда истину и жить согласно ней.</p>
                              <p className={styles.focusQuestion}>Определи, что будет твоим главным фокусом? С чем ты хотел бы однажды отпустить своих учеников?</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className={styles.strategyBlock}>
                      <div className={styles.strategyHeader}>
                          <span className={styles.strategyNumber}>2</span>
                          <h3 className={styles.strategyTitle}>Планирование (ежегодное)</h3>
                      </div>
                      <div className={styles.strategyContent}>
                          <p className={styles.text}>Когда ты будешь планировать, чем наполнять своё наставничество, ты можешь выбрать один из этих методов:</p>
                          
                          <ol className={styles.methodsList}>
                              <li className={styles.methodItem}>
                                  <strong>Углубление темы</strong> - возьми ту же историю, которую вы раскрывали на клубе или мероприятии на этой неделе, но зайди дальше. Попробуй посмотреть на неё шире и передать это своим ученикам.
                              </li>
                              <li className={styles.methodItem}>
                                  <strong>Системное чтение Писания</strong> - начните с Евангелия, затем перейдите к одному из посланий Павла (мы предлагаем Галатам, Эфесянам, Филиппийцам или Колоссянам для новичков). А через Псалмы и Притчи можно будет легко перейти к Ветхому Завету.
                              </li>
                              <li className={styles.methodItem}>
                                  <strong>Собственный пример</strong> - читай со своей малой группой то же самое, что ты читаешь самостоятельно. Или наоборот: читай самостоятельно то, что вы будете позже читать на малой группе или в личном общении с учеником. Это не лазейка, а идеальный пример того, каким сильным может быть наставничество, когда оно вытекает из твоего собственного ученичества.
                              </li>
                          </ol>
                      </div>
                  </div>
                  
                  <div className={styles.strategyBlock}>
                      <div className={styles.strategyHeader}>
                          <span className={styles.strategyNumber}>3</span>
                          <h3 className={styles.strategyTitle}>Подготовка (еженедельная)</h3>
                      </div>
                      <div className={styles.strategyContent}>
                          <p className={styles.text}>К каждой малой группе или личной встрече крайне важно готовиться заранее. Это не означает создание огромного чек-листа или написание библейского плана под каждый урок. Это означает проводить достаточно времени в нужном отрывке Писания, чтобы создать возможности для глубокого разговора и самому получить ответы на вопросы, которые могут появиться у твоих учеников.</p>
                          
                          <div className={styles.preparationTips}>
                              <h4 className={styles.tipsTitle}>Практические советы по подготовке:</h4>
                              <ul className={styles.tipsList}>
                                  <li className={styles.tipItem}>
                                      <span className={styles.tipIcon}>📖</span>
                                      Прочитать отрывок несколько раз, в разных переводах и даже аудиоверсии.
                                  </li>
                                  <li className={styles.tipItem}>
                                      <span className={styles.tipIcon}>✍️</span>
                                      Записывать свои мысли и вопросы при чтении.
                                  </li>
                                  <li className={styles.tipItem}>
                                      <span className={styles.tipIcon}>🔍</span>
                                      Узнать об этом отрывке больше, используя комментарии или соответствующие планы/видео.
                                  </li>
                                  <li className={styles.tipItem}>
                                      <span className={styles.tipIcon}>🔄</span>
                                      Перепиши отрывок своими словами, лучше несколько раз.
                                  </li>
                                  <li className={styles.tipItem}>
                                      <span className={styles.tipIcon}>🙏</span>
                                      Помолись перед прочтением. Не пренебрегай возможностью приглашать Бога в своё ученичество.
                                  </li>
                              </ul>
                              <p className={styles.tipNote}>Это не обязательно должно быть дотошным и всесторонним исследованием каждого слова. Просто приучай себя быть старательным учеником, чтобы воспитать такое же отношение к Писанию в тех, кого ты наставляешь.</p>
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className={styles.discussionSection}>
                  <h3 className={styles.discussionTitle}>Вопросы для обсуждения:</h3>
                  <ul className={styles.discussionList}>
                      <li className={styles.discussionItem}>
                          Как думаешь, как и через что именно ты раскрываешь своё призвание в наставничестве? На чём ты сфокусирован?
                      </li>
                      <li className={styles.discussionItem}>
                          Как ты сейчас планируешь своё наставничество на полгода или год вперёд?
                      </li>
                      <li className={styles.discussionItem}>
                          Как ты подготавливаешься к своему наставничеству в течение недели?
                      </li>
                      <li className={styles.discussionItem}>
                          Что ты хочешь делать, чтобы дальше расти в своих навыках планирования и подготовки как наставник?
                      </li>
                      <li className={styles.discussionItem}>
                          Как ты взаимодействуешь с другими лидерами в своих планировании и подготовке?
                      </li>
                  </ul>
              </div>
          </div>
      </div>
        </Container>
    </>
  );
};

export default ThreePrinciplesOfDiscipleship;