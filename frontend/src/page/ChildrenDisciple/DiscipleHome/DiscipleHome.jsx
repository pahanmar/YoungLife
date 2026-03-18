import React, { useMemo, useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Instrument from "/img/instrument.png";
import Main from "../../../components/Main/Main";
import CartPageContainer from "../../../components/CartPageContainer/CartPageContainer";
import { useAuth } from "../../../context/AuthContext";
import { usePermissions } from "../../../context/PermissionsContext";
import styles from "./DiscipleHome.module.css";

// Базовый URL бэкенда. Если не задан - ходим в API относительно текущего домена (`/api/...`).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function canAccessPath(permissions, user, path) {
  const rule = permissions[path] || { mode: "all", roles: [] };
  const userRoles = !user ? [] : (Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : []);
  const hasAny = (roles) => (roles || []).some((r) => userRoles.includes(r));
  if (rule.mode === "allow") return hasAny(rule.roles);
  if (rule.mode === "deny") return !hasAny(rule.roles);
  return true;
}

function DiscipleHome() {
  const { user } = useAuth();
  const { permissions } = usePermissions();
  const [downloadDocs, setDownloadDocs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/download-documents`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setDownloadDocs(Array.isArray(data) ? data : []))
      .catch(() => setDownloadDocs([]));
  }, []);

  const allCartData = [
    {
      title: "Что такое наставничество и ученичество",
      link: "/disciple/nastavnichestvo-i-uchenichestvo",
      image: "/img/note.png",
    },
    {
      title: "Идентичность и ценности",
      link: "/disciple/identichnost",
      image: "/img/star.png",
    },
    {
      title: "Изучать Библию целиком",
      link: "/disciple/izuchenie-biblii",
      image: "/img/bible.png",
    },
    {
      title: `3 "П" ученичества`,
      link: "/disciple/3-p-uchenichestva",
      image: "/img/success.png",
    },
    {
      title: "Жизнь, подражание, поклонение",
      link: "/disciple/zhizn-i-poklonenie",
      image: "/img/face.png",
    },
    {
      title: "Новое рождение и новая жизнь",
      link: "/disciple/novoe-rozhdenie",
      image: "/img/road.png",
    },
    {
      title: "Анатомия наставничества",
      link: "/disciple/anatomiya-nastavnichestva",
      image: "/img/people.png",
    },
    {
      title: "Два вида наставничества",
      link: "/disciple/vidy-nastavnichestva",
      image: "/img/cube.png",
    },
  ];

  const cartData = useMemo(() => {
    return allCartData.filter((item) => {
      const hasAccess = canAccessPath(permissions, user, item.link);
      const hideFromNav = !!permissions[item.link]?.hideFromNav;
      return hasAccess || !hideFromNav;
    });
  }, [permissions, user]);

  return (
    <>
      <Main img={Instrument} title={"Наставничество и ученичество"} description={"материалы для помощников, лидеров и руководителей"}/>
      <Container>
        <CartPageContainer cartData={cartData}/>
        <div className={styles.downloadsWrapper}>
          <h3 className={styles.downloadsTitle}>Документы для скачивания</h3>
          {downloadDocs.length === 0 ? (
            <p className={styles.downloadsEmpty}>Документов пока нет.</p>
          ) : (
            downloadDocs.map((doc) => (
              <a
                key={doc.id}
                href={doc.fileUrl}
                className={styles.downloadButton}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.iconUrl ? (
                  <img src={doc.iconUrl} alt="" className={styles.downloadButtonIcon} />
                ) : (
                  <span className={styles.buttonIcon}>📄</span>
                )}
                {doc.title}
              </a>
            ))
          )}
        </div>
      </Container>
    </>
  )
}

export default DiscipleHome;