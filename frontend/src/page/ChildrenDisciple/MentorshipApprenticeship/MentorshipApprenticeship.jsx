import React from 'react';
import styles from './MentorshipApprenticeship.module.css'; // Создадим этот файл для стилей
import Container from "../../../components/Container/Container.jsx";
import imgMain from "/img/note.png"
import Main from "../../../components/Main/Main.jsx";

const MentorshipApprenticeship = () => {
  return (
    <>
        <Main img={imgMain} title={"Что такое наставничество и ученичество"} description={""}/>
        <Container>
        <div className={styles.container}>
          <div className={styles.section}>
              <h2 className={styles.mainTitle}>Ученичество и наставничество: различие и единство</h2>
              
              <div className={styles.content}>
                  <p className={styles.leadText}>
                      У многих миссий и церквей есть своё понимание ученичества. Если мы напишем в 
                      поисковой строке «ученичество в христианстве», то в ответ получим тысячи разных 
                      ссылок и ответов.
                  </p>
                  
                  <div className={styles.definitionBlock}>
                      <p className={styles.definitionText}>
                          <strong>Оксфордский словарь</strong> говорит, что ученичество – это 
                          «статус, состояние или позиция ученика или открытого последователя Иисуса Христа».
                      </p>
                  </div>
                  
                  <p className={styles.text}>
                      В последнее время ученичество стало часто означать служение, направленное на
                      то, чтобы обучать других. Но есть несколько причин, по которым нам стоит
                      различать ученичество и наставничество.
                  </p>
                  
                  <h3 className={styles.subTitle}>Различие между ученичеством и наставничеством</h3>
                  
                  <div className={styles.differenceGrid}>
                      <div className={styles.differenceCard}>
                          <h4 className={styles.differenceTitle}>Во-первых</h4>
                          <p className={styles.differenceText}>
                              Это две разные вещи. Ученичество – это личное хождение человека со
                              Христом, это «Христос во мне». Наставничество – это служение другим. Это
                              «Христос через меня», одна из частей ученичества.
                          </p>
                      </div>
                      <div className={styles.differenceCard}>
                          <h4 className={styles.differenceTitle}>Во-вторых</h4>
                          <p className={styles.differenceText}>
                              Объединяя эти два понятия, нам легко приукрасить свою
                              собственную жизнь во Христе и сразу перейти к служению. Но наставничество
                              всегда должно вытекать из ученичества. Точно так же, как мы призваны сначала
                              любить Бога, а затем любить других.
                          </p>
                      </div>
                  </div>
                  
                  <p className={styles.text}>
                      В Янг Лайфе, мы решили остановиться на этих коротких и простых определениях:
                  </p>
                  
                  <ul className={styles.coreDefinitions}>
                      <li className={styles.coreDefinition}>
                          <span className={styles.definitionIcon}>👣</span>
                          <strong>ученичество:</strong> становиться более похожими на Христа (или, традиционным языком, «уподобляться Христу»)
                      </li>
                      <li className={styles.coreDefinition}>
                          <span className={styles.definitionIcon}>🤝</span>
                          <strong>наставничество:</strong> помогать другим стать более похожими на Христа
                      </li>
                      <li className={styles.coreDefinition}>
                          <span className={styles.definitionIcon}>🌟</span>
                          <strong>взращивание лидеров:</strong> помогать другим помогать другим становиться более похожими на Христа
                      </li>
                  </ul>
                  
                  <h3 className={styles.subTitle}>Расширенные определения</h3>
                  
                  <p className={styles.text}>
                      Каждое из этих определений может быть расширено. Когда мы расширяем эти понятия, мы начинаем больше погружаться в суть и понимать, что, почему и как происходит.
                  </p>
                  
                  <div className={styles.expandedDefinitions}>
                      <div className={styles.expandedDefinition}>
                          <h4 className={styles.expandedTitle}>Ученичество:</h4>
                          <p className={styles.expandedText}>становиться более похожим на Христа через...</p>
                          <ul className={styles.expandedList}>
                              <li>чтение Писания;</li>
                              <li>активную молитвенную жизнь;</li>
                              <li>узнавая, кто такой Бог и какие у Него планы на этот мир и на Его людей;</li>
                              <li>жизнь в послушании;</li>
                              <li>смиренное служение другим;</li>
                              <li>и так далее.</li>
                          </ul>
                      </div>
                      
                      <div className={styles.expandedDefinition}>
                          <h4 className={styles.expandedTitle}>Наставничество:</h4>
                          <p className={styles.expandedText}>помогать другим стать более похожими на Христа через...</p>
                          <ul className={styles.expandedList}>
                              <li>чтение Библии с ними;</li>
                              <li>глубокие разговоры о жизни и вере;</li>
                              <li>ободрение и помощь в выстраивании регулярной молитвенной жизни;</li>
                              <li>прославление Бога вместе с ними;</li>
                              <li>становясь примером в верности и послушании;</li>
                              <li>и так далее.</li>
                          </ul>
                      </div>
                  </div>
                  
                  <div className={styles.keyTruth}>
                      <p className={styles.keyText}>
                          <strong>Самая важная вещь:</strong> ваша собственная жизнь в ученичестве всегда идёт впереди вашего наставничества. 
                          Ученичество никогда не кончается и не бывает завершённым. Последователи Христа продолжают
                          обучаться, расти и становиться более похожим на Него на протяжении всей своей жизни.
                      </p>
                      <p className={styles.keyText}>
                          Последователи Христа призваны быть верными учениками, которые также верно и
                          наставляют. Это просто и сложно одновременно.
                      </p>
                  </div>
                  
                  <div className={styles.discussionSection}>
                      <h3 className={styles.discussionTitle}>Поразмышляйте и обсудите:</h3>
                      <ul className={styles.discussionList}>
                          <li className={styles.discussionItem}>
                              Как вы понимали слово «ученичество» до этого? Откуда вы взяли именно это определение?
                          </li>
                          <li className={styles.discussionItem}>
                              Почему, по-вашему, важно различать ученичество и наставничество? Как это может повлиять на вашу жизнь и служение?
                          </li>
                          <li className={styles.discussionItem}>
                              Как бы вы расширили эти понятия? Напишите свой собственный список и обсудите его с другими.
                          </li>
                      </ul>
                  </div>
                  
                  <div className={styles.scripturesSection}>
                      <h3 className={styles.scripturesTitle}>Несколько стихов о становлении более похожими на Иисуса:</h3>
                      <p className={styles.scriptureNote}>*каждый из этих отрывков имеет свой контекст, который важно и полезно учитывать.</p>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>2 Коринфянам 3:16-18</strong> - "Но когда человек обращается к Господу, покрывало снимается. Господь — это Дух, и всюду, где обитает Дух Господа, — там свобода! И мы все с открытыми лицами видим, как в зеркале, сияние славы Господа и изменяемся, становясь всё больше похожими на Него. Его слава в нас всё возрастает, ведь она исходит от Самого Господа, а Он есть Дух!"
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>Эфесянам 4:21-24</strong> - "Без сомнения, вы слышали о Нем и в Нем были научены истине, поскольку истина заключена в Иисусе. Вас учили тому, чтобы вы оставили прежний образ жизни, свойственный вашей старой природе, разлагающейся из-за своих обманчивых низменных желаний. Обновите ваш образ мыслей, оденьтесь в новую природу, созданную по образу Бога, — в истинную праведность и святость."
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>Эфесянам 5:1-2b</strong> - "Подражайте Богу, будучи Его любимыми детьми. Живите в любви, как и Христос нас полюбил…"
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>Филиппийцам 2:5</strong> - "Ваш образ мыслей должен быть таким же, как и образ мыслей Христа Иисуса."
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>Колоссянам 3:10</strong> - "Вы «оделись» в новую природу, которая обновляется истинным знанием, всё более отражая образ Самого Создателя."
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>1 Петра 1:14-16</strong> - "Как послушные дети не позволяйте управлять собой тем желаниям, что жили в вас, когда вы еще пребывали в неведении. Но будьте святы во всем, что бы вы ни делали, как свят Тот, Кто призвал вас, так как написано: «Будьте святы, потому что Я свят»."
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>1 Петра 2:21</strong> - "К этому вы были призваны, потому что и Христос пострадал за вас, оставив вам пример, чтобы вы следовали по Его стопам!"
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>1 Иоанна 2:3-6</strong> - "Мы можем быть уверены, что знаем Его, если соблюдаем Его повеления. Если кто-то говорит: «Я знаю Его», но не соблюдает Его повелений, тот лжец, и истины в нем нет. Но если человек послушен Его слову, тогда любовь Божья действительно достигла в нем своей полноты; это и показывает, что мы пребываем в Нем. Кто говорит, что он в Нем, тот должен и жить так, как жил Он."
                          </p>
                      </div>
                      
                      <div className={styles.scripture}>
                          <p className={styles.scriptureText}>
                              <strong>1 Иоанна 4:16b-17</strong> - "Бог есть любовь, и тот, кто пребывает в любви, пребывает в Боге, и Бог пребывает в нем. Любовь достигла среди нас совершенства, так что мы можем со всей уверенностью встречать День Суда, потому что каков Он, таковы и мы в этом мире."
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
        </Container>
    </>
  );
};

export default MentorshipApprenticeship;