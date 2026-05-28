import HeaderTwo from "../../../layouts/headers/FutureHeader";
import Brand from "../home-four/Brand";
import Category from "../home-four/Category";
import PropertyOne from "../home-four/PropertyOne";
import PropertyTwo from "../home-four/PropertyTwo";
import BLockFeatureOne from "../home-two/BLockFeatureOne";
import BLockFeatureTwo from "../home-two/BLockFeatureTwo";
import FancyBannerOne from "../home-two/FancyBannerOne";
import FancyBannerTwo from "../home-two/FancyBannerTwo";
import Feedback from "../home-two/FeedbackOne";
import HeroBanner from "../home-two/HeroBanner";

const HomeThree = () => {
  return (
    <>
      <HeaderTwo style_1={true} style_2={false} />
      <HeroBanner />
      <Category />
      <BLockFeatureOne />
      <PropertyOne />
      <PropertyTwo />
      <BLockFeatureTwo />
      <FancyBannerOne />
      <Feedback />
      <Brand />
      <FancyBannerTwo />
      <footer />
    </>
  );
};

export default HomeThree;
