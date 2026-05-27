import PropertyOne from "./FutureBigProperty";
import BLockFeatureTwo from "./FutureFeatureTwo";
import FancyBannerOne from "./FutureBannerOne";
import Brand from "./FutureBrand";
import FancyBannerTwo from "./FutureBannerTwo";
import FooterTwo from "../../../layouts/footers/FutureFooter";
import PropertyTwo from "./FutureListingHero";
import Feedback from "./FutureFeedback";
import FutureHeader from "../../../layouts/headers/FutureHeader";
import FutureHeroBanner from "./FutureHeroBanner";
import FutureCategory from "./FutureCategory";
import FutureFeatureOne from "./FutureFeatureOne";
import FutureBigProperty from "./FutureBigProperty";
import FutureFeatureTwo from "./FutureFeatureTwo";
import FutureBannerOne from "./FutureBannerOne";
import FutureListingHero from "./FutureListingHero";
import FutureFeedback from "./FutureFeedback";
import FutureBrand from "./FutureBrand";
import FutureBannerTwo from "./FutureBannerTwo";
import FutureFooter from "../../../layouts/footers/FutureFooter";

const FutureHome = () => {
  return (
    <>
      <FutureHeader style_1={true} style_2={false} />
      <FutureHeroBanner />
      <FutureCategory style={false} />
      <FutureFeatureOne />
      <FutureBigProperty />
      <FutureListingHero style={false} />
      <FutureFeatureTwo />
      <FutureBannerOne />
      <FutureFeedback style={false} />
      <FutureBrand />
      <FutureBannerTwo />
      <FutureFooter />
    </>
  );
};

export default FutureHome;
