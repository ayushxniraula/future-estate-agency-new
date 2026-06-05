import FutureFooter from "../../../layouts/footers/FutureFooter";
import FutureHeader from "../../../layouts/headers/FutureHeader";
import NavMenu from "../../../layouts/headers/Menu/FutureNavMenu";
import FancyBanner from "../../common/FancyBanner";
import ListingThirteenArea from "./FutureBuyListing";

const ListingThirteen = () => {
  return (
    <>
      <NavMenu />
      <ListingThirteenArea />
      <FancyBanner />
      <FutureFooter />
    </>
  );
};

export default ListingThirteen;
