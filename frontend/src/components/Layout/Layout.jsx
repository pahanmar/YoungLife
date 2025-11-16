import { Outlet } from "react-router-dom";
import ScrollTo from "../ScrollTo/ScrollTo";

export default function Layout({ children }) {
  return (
    <>
      <ScrollTo />
      {children || <Outlet />}
    </>
  );
}
