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
import NavMenu from "../../../layouts/headers/Menu/FutureNavMenu";

const FutureHome = () => {
  return (
    <>
      {/* <NavMenu /> */}
      <NavMenu />
      <FutureHeroBanner />
      {/* <FutureCategory style={false} /> */}
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
