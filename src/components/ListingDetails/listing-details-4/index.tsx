import FutureFooter from "../../../layouts/footers/FutureFooter";
import NavMenu from "../../../layouts/headers/Menu/FutureNavMenu";
import FancyBanner from "../../common/FancyBanner";
import ListingDetailsFourArea from "./BuyDetail";

const ListingDetailsFour = () => {
  return (
    <>
      <NavMenu /> <ListingDetailsFourArea />
      <FancyBanner />
      <FutureFooter />
    </>
  );
};

export default ListingDetailsFour;
