const routes = [
  { path: "", component: "page/Home/Home.jsx", label: "Home" },
  { path: "books", component: "page/Books/Books.jsx", label: "Books" },

  {
    path: "disciple",
    component: "page/Disciple/Disciple.jsx",
    label: "Disciple",
    children: [
      { path: "", component: "page/ChildrenDisciple/DiscipleHome/DiscipleHome.jsx", label: "DiscipleHome" },
      { path: "nastavnichestvo-i-uchenichestvo", component: "page/ChildrenDisciple/MentorshipApprenticeship/MentorshipApprenticeship.jsx", label: "MentorshipApprenticeship" },
      { path: "identichnost", component: "page/ChildrenDisciple/IdentityInChrist/IdentityInChrist.jsx", label: "IdentityInChrist" },
      { path: "izuchenie-biblii", component: "page/ChildrenDisciple/BibleStudy/BibleStudy.jsx", label: "BibleStudy" },
      { path: "3-p-uchenichestva", component: "page/ChildrenDisciple/ThreePrinciplesOfDiscipleship/ThreePrinciplesOfDiscipleship.jsx", label: "ThreePrinciplesOfDiscipleship" },
      { path: "novoe-rozhdenie", component: "page/ChildrenDisciple/NewBirth/NewBirth.jsx", label: "NewBirth" },
      { path: "anatomiya-nastavnichestva", component: "page/ChildrenDisciple/AnatomyOfMentorship/AnatomyOfMentorship.jsx", label: "AnatomyOfMentorship" },
      { path: "vidy-nastavnichestva", component: "page/ChildrenDisciple/TypesOfMentorship/TypesOfMentorship.jsx", label: "TypesOfMentorship" },
      { path: "zhizn-i-poklonenie", component: "page/ChildrenDisciple/LivePoklonenie/LivePoklonenie.jsx", label: "LivePoklonenie" },
    ]
  },

  // Admin route (protected by rule '/admin')
  { path: "admin", component: "page/AdminPanel/AdminPanel.jsx", label: "Admin", guard: true, rulePath: "/admin" },

  // Auth (you may keep these as public routes outside this config if you prefer)
  { path: "login", component: "Login.jsx", label: "Login" },
  { path: "register", component: "Register.jsx", label: "Register" },

  // add here other routes if needed
];

export default routes;