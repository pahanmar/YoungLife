import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home/Home.jsx";
import './index.css'
import Books from "./page/Books/Books.jsx";
import Disciple from "./page/Disciple/Disciple.jsx";
import MentorshipApprenticeship from "./page/ChildrenDisciple/MentorshipApprenticeship/MentorshipApprenticeship.jsx";
import IdentityInChrist from "./page/ChildrenDisciple/IdentityInChrist/IdentityInChrist.jsx";
import BibleStudy from "./page/ChildrenDisciple/BibleStudy/BibleStudy.jsx";
import ThreePrinciplesOfDiscipleship from "./page/ChildrenDisciple/ThreePrinciplesOfDiscipleship/ThreePrinciplesOfDiscipleship.jsx";
import NewBirth from "./page/ChildrenDisciple/NewBirth/NewBirth.jsx";
import AnatomyOfMentorship from "./page/ChildrenDisciple/AnatomyOfMentorship/AnatomyOfMentorship.jsx";
import TypesOfMentorship from "./page/ChildrenDisciple/TypesOfMentorship/TypesOfMentorship.jsx";
import DiscipleHome from "./page/ChildrenDisciple/DiscipleHome/DiscipleHome.jsx";
import LivePoklonenie from "./page/ChildrenDisciple/LivePoklonenie/LivePoklonenie.jsx";
import Layout from "./components/Layout/Layout.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home/></Layout>,
  },
  {
    path: "books",
    element: <Layout><Books/></Layout>, // как в магазинах, товары книг
  },
  // {
  //   path: "worksheet", 
  //   element: <Worksheet/>, // рабочея тетрадь, Тима должен скинуть материал, наивысший приоретет
  // },
  {
    path: "disciple", // наставничество и учениство //https://discipleship.younglife.org/whys-and-how-tos/ BIG PICTURE STUFF
    element: <Layout><Disciple/></Layout>,
    children: [
      {
        index: true,
        element: <Layout><DiscipleHome/></Layout>,
      },
      {
        path: "nastavnichestvo-i-uchenichestvo", 
        element: <Layout><MentorshipApprenticeship/></Layout>,
      },
      {
        path: "identichnost", 
        element: <Layout><IdentityInChrist/></Layout>,
      },
      {
        path: "izuchenie-biblii", 
        element: <Layout><BibleStudy/></Layout>,
      },
      {
        path: "3-p-uchenichestva", 
        element: <Layout><ThreePrinciplesOfDiscipleship/></Layout>,
      },
      {
        path: "novoe-rozhdenie", 
        element: <Layout><NewBirth/></Layout>,
      },
      {
        path: "anatomiya-nastavnichestva", 
        element: <Layout><AnatomyOfMentorship/></Layout>,
      },
      {
        path: "vidy-nastavnichestva", 
        element: <Layout><TypesOfMentorship/></Layout>,
      },
      {
        path: "zhizn-i-poklonenie", 
        element: <Layout><LivePoklonenie/></Layout>,
      },
    ]
  },
  // {
  //   path: "evaluation",
  //   element: <Evalution/>,
  // },
  // {
  //   path: "/training",
  //   element: <About />,
  //   children: [ // Вложенные маршруты
  //     {
  //       path: "books",
  //       element: "", // как в магазинах, товары книг
  //     },
  //     {
  //       path: "worksheet", 
  //       element: <About />, // рабочея тетрадь, Тима должен скинуть материал, наивысший приоретет
  //     },
  //   ],
  // },
  // {
  //   path: "/practical",
  //   element: "",
  //   children: [ // Вложенные маршруты
  //     {
  //       path: "cabin", 
  //       element: "", // малые группы, там 
  //     },
  //     {
  //       path: "disciple", // наставничество и учениство //https://discipleship.younglife.org/whys-and-how-tos/ BIG PICTURE STUFF
  //       element: "",
  //     },
  //     {
  //       path: "storytelling", 
  //       element: "",
  //     },
  //   ],
  // },
  // {
  //   path: "/teamleading",
  //   element: "",
  //   children: [ 
  //     {
  //       path: "evaluation",
  //       element: "",
  //     },
  //   ],
  // },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;