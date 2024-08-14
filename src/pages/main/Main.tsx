import { Navbar } from "@components/Navbar";
import { Outlet } from "react-router-dom";

export const Main = () => {
  return (
      <Navbar>
        <Outlet/>
      </Navbar>
  )
}
