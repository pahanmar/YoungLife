import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout/Layout.jsx";
import Home from "./page/Home/Home.jsx";
import Books from "./page/Books/Books.jsx";
import Disciple from "./page/Disciple/Disciple.jsx";
import DiscipleHome from "./page/ChildrenDisciple/DiscipleHome/DiscipleHome.jsx";
import MentorshipApprenticeship from "./page/ChildrenDisciple/MentorshipApprenticeship/MentorshipApprenticeship.jsx";
import IdentityInChrist from "./page/ChildrenDisciple/IdentityInChrist/IdentityInChrist.jsx";
import BibleStudy from "./page/ChildrenDisciple/BibleStudy/BibleStudy.jsx";
import ThreePrinciplesOfDiscipleship from "./page/ChildrenDisciple/ThreePrinciplesOfDiscipleship/ThreePrinciplesOfDiscipleship.jsx";
import NewBirth from "./page/ChildrenDisciple/NewBirth/NewBirth.jsx";
import AnatomyOfMentorship from "./page/ChildrenDisciple/AnatomyOfMentorship/AnatomyOfMentorship.jsx";
import TypesOfMentorship from "./page/ChildrenDisciple/TypesOfMentorship/TypesOfMentorship.jsx";
import LivePoklonenie from "./page/ChildrenDisciple/LivePoklonenie/LivePoklonenie.jsx";

import Register from "./Register.jsx";
import Login from "./Login.jsx";
import AdminPanel from "./page/AdminPanel/AdminPanel.jsx";

import { PrivateRoute as ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute.jsx";
import { AuthProvider as RealAuthProvider } from "./context/AuthContext";
import { PermissionsProvider, usePermissions } from "./context/PermissionsContext";
import RouteGuard from "./components/RouteGuard/RouteGuard.jsx";

import "./index.css";

// небольшая хелпер-функция: получает правило по пути
const getRule = (permissions, path) => permissions[path] ?? { mode: 'all', roles: [] };

const NotFound = () => (
  <div style={{ padding: 24 }}>
    <h2>Страница не найдена (404)</h2>
    <p>
      Возможно, вы ошиблись в адресе. <a href="/">Вернуться на главную</a>
    </p>
  </div>
);

// Сборщик маршрутов вынесен в компонент, чтобы можно было использовать хук usePermissions
function RouterConfig() {
  const { permissions } = usePermissions();

  return createBrowserRouter([
    { path: "login", element: <Layout><Login /></Layout> },
    { path: "register", element: <Layout><Register /></Layout> },

    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: "books", element: <Books /> },

        {
          path: "disciple",
          element: <Disciple />,
          children: [
            { index: true, element: <DiscipleHome /> },
            { path: "nastavnichestvo-i-uchenichestvo", element: <MentorshipApprenticeship /> },
            { path: "identichnost", element: <IdentityInChrist /> },
            { path: "izuchenie-biblii", element: <BibleStudy /> },
            { path: "3-p-uchenichestva", element: <ThreePrinciplesOfDiscipleship /> },
            { path: "novoe-rozhdenie", element: <NewBirth /> },
            { path: "anatomiya-nastavnichestva", element: <AnatomyOfMentorship /> },
            { path: "vidy-nastavnichestva", element: <TypesOfMentorship /> },
            { path: "zhizn-i-poklonenie", element: <LivePoklonenie /> },
          ]
        },

        // admin: берем правило по '/admin'
        {
          path: "admin",
          element: (
            <RouteGuard rule={getRule(permissions, '/admin')}>
              <Layout><AdminPanel /></Layout>
            </RouteGuard>
          )
        }
      ]
    },
  ]);
}

function App() {
  return (
    <RealAuthProvider>
      <PermissionsProvider>
        <RouterProvider router={RouterConfig()} />
      </PermissionsProvider>
    </RealAuthProvider>
  );
}

export default App;