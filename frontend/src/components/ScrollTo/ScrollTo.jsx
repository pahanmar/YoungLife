import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollTo() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo({
        top: 0,
      });
    }, [pathname]);
  
    return null;
}

// Вставьте этот компонент в ваш App.js (или корневой компонент)
export default ScrollTo;

