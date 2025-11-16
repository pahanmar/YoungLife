import React from "react";
import Jesus from "/img/jesus-teaching.svg"
import Container from "../../components/Container/Container.jsx";
import styles from './Home.module.css';
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Main from "../../components/Main/Main.jsx";
import CartPageContainer from "../../components/CartPageContainer/CartPageContainer.jsx";



function Home() {

  const cartData = [
    {
      title: "Книги",
      link: "/books",
      image: "/img/book.png",
    },
    {
      title: "Наставничество и ученичество",
      link: "/disciple",
      image: "/img/instrument.png",
    },
  ];


  return (
    <>
      <Navbar/>
      <Main img={Jesus} title={"Янг Лайф Россия"} description={"материалы для помощников, лидеров и руководителей"}/>
      <Container>
        <CartPageContainer cartData={cartData}/>
      </Container>
      <Footer/>
    </>
  )
}

export default Home;