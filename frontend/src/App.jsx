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

import Login from "./Login.jsx";
import AdminPanel from "./page/AdminPanel/AdminPanel.jsx";

import { PrivateRoute as ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute.jsx";
import { AuthProvider as RealAuthProvider } from "./context/AuthContext";
import { PermissionsProvider } from "./context/PermissionsContext";
import RouteGuard from "./components/RouteGuard/RouteGuard.jsx";

import "./index.css";

const NotFound = () => (
  <div style={{ padding: 24 }}>
    <h2>Страница не найдена (404)</h2>
    <p>
      Возможно, вы ошиблись в адресе. <a href="/">Вернуться на главную</a>
    </p>
  </div>
);

function RouterConfig() {
  return createBrowserRouter([
    { path: "login", element: <Layout><Login /></Layout> },

    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <RouteGuard path="/"><Home /></RouteGuard> },
        { path: "books", element: <RouteGuard path="/books"><Books /></RouteGuard> },
        {
          path: "disciple",
          element: <RouteGuard path="/disciple"><Disciple /></RouteGuard>,
          children: [
            { index: true, element: <RouteGuard path="/disciple"><DiscipleHome /></RouteGuard> },
            { path: "nastavnichestvo-i-uchenichestvo", element: <RouteGuard path="/disciple/nastavnichestvo-i-uchenichestvo"><MentorshipApprenticeship /></RouteGuard> },
            { path: "identichnost", element: <RouteGuard path="/disciple/identichnost"><IdentityInChrist /></RouteGuard> },
            { path: "izuchenie-biblii", element: <RouteGuard path="/disciple/izuchenie-biblii"><BibleStudy /></RouteGuard> },
            { path: "3-p-uchenichestva", element: <RouteGuard path="/disciple/3-p-uchenichestva"><ThreePrinciplesOfDiscipleship /></RouteGuard> },
            { path: "novoe-rozhdenie", element: <RouteGuard path="/disciple/novoe-rozhdenie"><NewBirth /></RouteGuard> },
            { path: "anatomiya-nastavnichestva", element: <RouteGuard path="/disciple/anatomiya-nastavnichestva"><AnatomyOfMentorship /></RouteGuard> },
            { path: "vidy-nastavnichestva", element: <RouteGuard path="/disciple/vidy-nastavnichestva"><TypesOfMentorship /></RouteGuard> },
            { path: "zhizn-i-poklonenie", element: <RouteGuard path="/disciple/zhizn-i-poklonenie"><LivePoklonenie /></RouteGuard> },
          ]
        },

        {
          path: "admin",
          element: (
            <RouteGuard path="/admin">
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