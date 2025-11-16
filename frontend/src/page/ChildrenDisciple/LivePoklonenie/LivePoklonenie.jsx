import React from 'react';
import styles from './LivePoklonenie.module.css'; // Создадим этот файл для стилей
import Container from "../../../components/Container/Container.jsx";
import imgMain from "/img/face.png"
import Main from "../../../components/Main/Main.jsx";



const LivePoklonenie = () => {  
  return (
    <>
        <Main img={imgMain} title={"Жизнь, подражание, поклонение"} description={"рассказывать Евангелие полностью"}/>
        <Container>
        <div className={styles.container}>
          <div className={styles.section}>
              <h2 className={styles.mainTitle}>Три основы наставничества</h2>
              
              <div className={styles.intro}>
                  <p className={styles.introText}>Эти три важные темы помогут тебе обозначить рамки своего наставничества:</p>
                  <ul className={styles.themeList}>
                      <li className={styles.themeItem}>Жизнь во Христе</li>
                      <li className={styles.themeItem}>Подражание Христу</li>
                      <li className={styles.themeItem}>Поклонение Христу</li>
                  </ul>
                  <p className={styles.introText}>Все они вплетены в библейский нарратив и пересекаются с тем, что некоторые молодёжные эксперты называют главными заботами подросткового возраста: идентичность, предназначение и принадлежность.</p>
              </div>
              
              <div className={styles.subSection}>
                  <h3 className={styles.subTitle}>Жизнь во Христе</h3>
                  <div className={styles.content}>
                      <p className={styles.text}>До тех пор, пока мы не знакомим ребят со Христом, который призывает их пребывать в Нём, мы не рассказываем Евангелие полностью. Пребывая во Христе, мы каждый день умираем для себя, чтобы быть воскресшими и изменёнными в новое творение.</p>
                      <p className={styles.text}>Жизнь во Христе означает, что мы живём, двигаемся и существуем только в Нём, и без Него не имеем жизни. Это значит, что Христос - источник и центр нашей жизни.</p>
                      <p className={styles.text}>Такое не происходит за ночь, на это нужна целая жизнь: мы движемся от нашей искренней веры к нашей личной вере, а оттуда к вере, которая стоит в центре всего. Мы никогда не останавливаемся на этом пути и помогаем проходить его тем, кого наставляем.</p>
                  </div>
              </div>
              
              <div className={styles.subSection}>
                  <h3 className={styles.subTitle}>Подражание Христу</h3>
                  <div className={styles.content}>
                      <p className={styles.text}>Рассказать Евангелие полностью означает познакомить ребят со Христом, который призывает их умереть для греха и стать больше как Он в мыслях, словах и действиях. Писание полно призывов жить, любить, служить и слушаться как Иисус.</p>
                      <p className={styles.text}>Если мы живём со Христом, то постепенно мы должны начинать жить как Христос. Становясь больше как Он, мы также восстанавливаем изначальный замысел Бога. Мы снова становимся людьми по Его образу и подобию. Глобальные духовные изменения - это работа Святого Духа, но она требует нашего участия и послушания.</p>
                  </div>
              </div>
              
              <div className={styles.subSection}>
                  <h3 className={styles.subTitle}>Поклонение Христу</h3>
                  <div className={styles.content}>
                      <p className={styles.text}>Рассказывать полное Евангелие означает, в том числе, говорить о том, что Христос - это Царь.</p>
                      <p className={styles.text}>Благая Весть об Иисусе Христе заключается в том, что единственный истинный Царь Царей пришёл, чтобы занять своё место на престоле. Более того, Он приглашает каждого присоединиться к Его Царству через покаяние и принятие. Благая Весть в том, что у этого беспорядочного мира есть добрый и вечный Царь, и мы можем жить в Его любви и уверенности.</p>
                      <div className={styles.summary}>
                          <ul className={styles.summaryList}>
                              <li className={styles.summaryItem}>Наша идентичность найдена во Христе;</li>
                              <li className={styles.summaryItem}>Наше предназначение в том, чтобы уподобляться Христу;</li>
                              <li className={styles.summaryItem}>Наша принадлежность - во Христе.</li>
                          </ul>
                      </div>
                  </div>
              </div>
              
              <div className={styles.discussionSection}>
                  <h3 className={styles.discussionTitle}>Вопросы для обсуждения</h3>
                  <ul className={styles.discussionList}>
                      <li className={styles.discussionItem}>Как три этих вещи помогают создать рамки для твоего ученичества и наставничества?</li>
                      <li className={styles.discussionItem}>Как ты можешь помочь своим ученикам понять важность поклонения Христу и признания Его авторитета во всех сферах нашей жизни? Как это пересекается с Его любовью и милостью?</li>
                      <li className={styles.discussionItem}>Какими конкретными способами ты можешь развить своё ученичество и наставничество в каждом из этих трёх направлений?</li>
                  </ul>
              </div>
          </div>
      </div>
        </Container>
    </>
  );
};

export default LivePoklonenie;