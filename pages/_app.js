import { useEffect, useState } from "react";
import Disclaimer from "../components/Disclaimer";
import { initSocket } from "../context/Socket";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  const [RulesShown, setRulesShown] = useState(false);
  useEffect(() => {
    fetch("/api/")
    initSocket();
  }, [])

  if (!RulesShown) return <Disclaimer setRulesShown={setRulesShown} />;
  return (
    <Component
      RulesShown={RulesShown}
      setRulesShown={setRulesShown}
      {...pageProps}
    />
  );
}

export default MyApp;
