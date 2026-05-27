import HeroBanner from "./HeroBanner";
import Category from "./Category";
import BLockFeatureOne from "./BLockFeatureOne";
import PropertyOne from "./PropertyOne";
import BLockFeatureTwo from "./BLockFeatureTwo";
import FancyBannerOne from "./FancyBannerOne";
import Brand from "./Brand";
import FancyBannerTwo from "./FancyBannerTwo";
import Footer from "../../../layouts/footers/Footer";
import PropertyTwo from "./PropertyTwo";
import Feedback from "./Feedback";
import HeaderTwo from "../../../layouts/headers/FutureHeader";

const HomeThree = () => {
  return (
    <>
      <HeaderTwo style_1={true} style_2={false} />
      <HeroBanner />
      <Category style={false} />
      <BLockFeatureOne />
      <PropertyOne />
      <PropertyTwo style={false} />
      <BLockFeatureTwo />
      <FancyBannerOne />
      <Feedback style={false} />
      <Brand />
      <FancyBannerTwo />
      <Footer />
    </>
  );
};

export default HomeThree;
