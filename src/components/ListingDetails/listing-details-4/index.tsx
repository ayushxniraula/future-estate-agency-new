import FutureFooter from "../../../layouts/footers/FutureFooter";
import FutureHeader from "../../../layouts/headers/FutureHeader";
import FancyBanner from "../../common/FancyBanner";
import ListingDetailsFourArea from "./BuyDetail";

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
