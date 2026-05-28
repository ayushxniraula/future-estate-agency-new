import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
import HomeThree from "../components/homes/futurehome/FutureHome";

const Home = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Homy"} />
      <HomeThree />
    </Wrapper>
  );
};

export default Home;
