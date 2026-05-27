import BLockFeatureOne from "./BLockFeatureOne";
import BLockFeatureTwo from "./BLockFeatureTwo";
import Brand from "./Brand";
import FancyBanner from "./FancyBanner";
import BreadcrumbTwo from "../../../common/breadcrumb/BreadcrumbTwo";
import HeaderTwo from "../../../../layouts/headers/FutureHeader";
import Feedback from "../../../homes/home-six/Feedback";
import FooterTwo from "../../../../layouts/footers/FutureFooter";

const AboutUsTwo = () => {
  return (
    <>
      <HeaderTwo style_1={true} style_2={false} />
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
