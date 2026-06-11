import { useState } from "react";
import FutureFooter from "../../../layouts/footers/FutureFooter";
import NavMenu from "../../../layouts/headers/Menu/FutureNavMenu";
import LoginModal from "../../../modals/LoginModal";
import ListingThirteenArea from "./FutureBuyListing";
import { useClientSession } from "../../../my-components/userclientsession";

const ListingThirteen = () => {
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
  return (
    <>
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <ListingThirteenArea />
      {/* <FancyBanner /> */}
      <FutureFooter />
    </>
  );
};

export default ListingThirteen;
