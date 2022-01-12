import { NavBar } from "../../utilities/components/navbar/NavBar";
import { Footer } from "../../utilities/components/footer/Footer"
import { Header } from "./header/Header"
import { useState } from "react";
import { checkCookie } from "../../utilities/functions/cookies";

export function Login():JSX.Element {
 
  const [logged, setLogged] = useState(checkCookie("accessToken"));

  return (
    <div className="login">
      <NavBar logged={logged} logOut={()=>setLogged(false)}/>
      <Header/>
      <Footer/>
    </div>
  );
}