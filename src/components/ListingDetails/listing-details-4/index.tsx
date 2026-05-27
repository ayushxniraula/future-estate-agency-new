import FooterFour from "../../../layouts/footers/FooterFour";
import FutureFooter from "../../../layouts/footers/FutureFooter";
import FutureHeader from "../../../layouts/headers/FutureHeader";
import HeaderFour from "../../../layouts/headers/HeaderFour";
import FancyBanner from "../../common/FancyBanner";
import ListingDetailsFourArea from "./ListingDetailsFourArea";

const ListingDetailsFour = () => {
  return (
    <>
      <FutureHeader style_1={true} style_2={false} /> <ListingDetailsFourArea />
      <FancyBanner />
      <FutureFooter />
    </>
  );
};

export default ListingDetailsFour;
