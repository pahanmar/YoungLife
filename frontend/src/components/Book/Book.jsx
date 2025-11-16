import React from 'react';
import { FiDownload } from 'react-icons/fi';
import styles from './Book.module.css';

const Book = ({ bookData = {} }) => {
  const { 
    title, 
    author, 
    coverImage, 
    description, 
    downloadLink, 
  } = bookData;  

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.cover}>
          <img 
            src={coverImage} 
            alt={`Обложка книги "${title}"`} 
            className={styles.coverImage}
          />
        </div>
        
        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.author}>{author}</p>
          
          <div className={styles.description}>
            <p>{description}</p>
          </div>
        </div>
      </div>
      
      <div className={styles.download}>
        <a 
          href={downloadLink} 
          className={styles.button}
          download
        >
          <FiDownload />
          Скачать книгу
        </a>
      </div>
    </div>
  );
};

export default Book;