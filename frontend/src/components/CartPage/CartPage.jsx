import React from "react";
import styles from './CartPage.module.css';
import { Link } from "react-router-dom";

function CartPage({ cartData = {}, numberHover }) {
    const { 
        title, 
        link, 
        image, 
    } = cartData;  
    
    const hoverStyle = numberHover % 2 === 0 ? styles.cartHoverFirst : styles.cartHoverSecond;

    return (
        <Link className={`${styles.cartPage} ${hoverStyle}`} to={link}>
            <h3 className={styles.cartTitle}>{title}</h3>
            <div className={styles.imageWrapper}>
                <img className={styles.cartImg} src={image} alt="" />
            </div>
        </Link>
    );
}

export default CartPage;