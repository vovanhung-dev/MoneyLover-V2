import { ReactNode, useEffect, useState } from "react";
import { Footer, Header } from "../components";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="md:mx-20 mx-10 lg:mx-auto">
      <Header className={scrollPosition > 0 ? " shadow-lg" : ""} />
      {children}
      <Footer />
    </div>
  );
};

export default DefaultLayout;
