import FutureFooter from "../../../layouts/footers/FutureFooter";
import FutureHeader from "../../../layouts/headers/FutureHeader";
import FancyBanner from "../../common/FancyBanner";
import ListingThirteenArea from "./FutureBuyListing";

const ListingThirteen = () => {
  return (
    <>
      <FutureHeader style_1={true} style_2={false} />
      <ListingThirteenArea />
      <FancyBanner />
      <FutureFooter />
    </>
  );
};

export default ListingThirteen;
