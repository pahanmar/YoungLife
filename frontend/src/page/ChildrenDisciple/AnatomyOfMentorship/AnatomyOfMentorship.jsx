import React from 'react';
import styles from './AnatomyOfMentorship.module.css'; // Создадим этот файл для стилей
import Container from "../../../components/Container/Container.jsx";
import imgMain from "/img/people.png"
import Main from "../../../components/Main/Main.jsx";

const AnatomyOfMentorship = () => {
  return (
    <>
        <Main img={imgMain} title={"Анатомия наставничества"} description={"множество контекстов наставничества"}/>
        <Container>
        <div className={styles.container}>
    <div className={styles.section}>
        <h4 className={styles.title}>Бок о бок:</h4>
        <div className={styles.content}>
            <p className={styles.text}>Контекст, завязанный на какой-то активности. Для тех, кто пока не готов говорить лицом к лицу, всё ещё учится чувствовать себя комфортно в диалоге или просто нуждается в физической активности для концентрации.</p>
            <p className={styles.text}>Может включать в себя игру или соревнование, куда аккуратно вставлены вопросы, беседы или активное слушание.</p>
            <p className={`${styles.text} ${styles.highlightText}`}>Это про: отношения, действия, общение, комфорт и подготовку к более глубоким диалогам.</p>
        </div>
    </div>

    <div className={styles.section}>
        <h4 className={styles.title}>Лицом к лицу:</h4>
        <div className={styles.content}>
            <p className={styles.text}>Личные встречи с целью ободрить и помочь кому-то развиться личностно и духовно.</p>
            <p className={styles.text}>Может включать в себя всё то же самое, что и "Лицом к лицу", плюс более глубокие уровни наставничества, вызовы и поощрение.</p>
            <p className={`${styles.text} ${styles.highlightText}`}>Это про: отношения, общение, посвященность, обучение, пасторство.</p>
        </div>
    </div>

    <div className={styles.section}>
        <h4 className={styles.title}>Коленом к колену</h4>
        <div className={styles.content}>
            <p className={styles.text}>Особенное время наедине, дополняющее "Глаза в глаза" и фокусирующееся не только на развитии и росте, но и на направлении человека, и даже перенаправлении, когда оно нужно.</p>
            <p className={styles.text}>Может включать в себя молитву, изучение Библии, глубокие (и даже тяжелые) диалоги, пасторское слушание, помощь, исправление, утверждение и советы.</p>
            <p className={`${styles.text} ${styles.highlightText}`}>Это про: отношения, пасторство, обучение, назидание, коррекцию.</p>
        </div>
    </div>

    <div className={styles.section}>
        <h4 className={styles.title}>Плечом к плечу:</h4>
        <div className={styles.content}>
            <p className={`${styles.text} ${styles.highlightText}`}>Совместная работа в служении или миссии. Это про: отношения, миссиональность, сотрудничество, контекст Царства, фокус на служении, жертвенность.</p>
        </div>
    </div>

    <div className={styles.section}>
        <h4 className={styles.title}>Рука к руке:</h4>
        <div className={styles.content}>
            <p className={styles.text}>Общение двух и более последователей Христа в молитве, партнёрстве, согласии и единстве; проповедующее, что мы одна семья, служим одному Богу, спасены одним Христом, разделяем одного Духа, имеем одну надежду и неподдельно любим друг друга.</p>
        </div>
    </div>

    <div className={styles.discussionSection}>
        <h4 className={styles.titleCenter}>Вопросы для обсуждения:</h4>
        <ul className={styles.list}>
            <li className={styles.listItem}>Какой контекст наставничества для тебя самый комфортный и почему?</li>
            <li className={styles.listItem}>Какой наименее комфортный? Почему?</li>
            <li className={styles.listItem}>В каком контексте сейчас проходит основная часть твоего служения? Как это выглядит?</li>
            <li className={styles.listItem}>Какими конкретными способами ты бы мог вывести своё наставничество на новый уровень в разных контекстах?</li>
            <li className={styles.listItem}>Кто сейчас имеет с тобой отношения "колено к колену"? Как это выглядит? Как ты вырос и изменился через это?</li>
        </ul>
    </div>
</div>
        </Container>
    </>
  );
};

export default AnatomyOfMentorship;