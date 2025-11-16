import React from "react";
import Container from "../../components/Container/Container";
import styles from './Disciple.module.css';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Instrument from "/img/instrument.png"
import Main from "../../components/Main/Main";
import CartPageContainer from "../../components/CartPageContainer/CartPageContainer";
import { Outlet } from "react-router-dom";



function Disciple() {

  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default Disciple;