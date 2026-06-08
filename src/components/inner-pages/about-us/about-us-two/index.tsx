import BLockFeatureOne from "./BLockFeatureOne";
import BLockFeatureTwo from "./BLockFeatureTwo";
import Brand from "./Brand";
import FancyBanner from "./FancyBanner";
import BreadcrumbTwo from "../../../common/breadcrumb/BreadcrumbTwo";
import Feedback from "../../../homes/home-six/Feedback";
import FooterTwo from "../../../../layouts/footers/FutureFooter";
import { useClientSession } from "../../../../my-components/userclientsession";
import { useState } from "react";
import NavMenu from "../../../../layouts/headers/Menu/FutureNavMenu";
import LoginModal from "../../../../modals/LoginModal";

const AboutUsTwo = () => {
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
  return (
    <>
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <BreadcrumbTwo title="About Agency" sub_title="About us" />
      <BLockFeatureOne />
      <BLockFeatureTwo />
      <Feedback />
      <Brand />
      <FancyBanner />
      <FooterTwo />
    </>
  );
};

export default AboutUsTwo;
