import FutureHeroBanner from "./FutureHeroBanner";
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
import LoginModal from "../../../modals/LoginModal";
import { useClientSession } from "../../../my-components/userclientsession";
import { useState } from "react";
import CategorySection from "../../../my-components/CategoryFuture";

const FutureHome = () => {
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
  return (
    <>
      {/* <NavMenu /> */}
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <FutureHeroBanner />
      <CategorySection />

      {/* <FutureCategory style={false} /> */}
      <FutureFeatureOne />
      {/* <FutureBigProperty /> */}
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
