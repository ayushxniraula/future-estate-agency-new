import { useState } from "react";
import FutureFooter from "../../../layouts/footers/FutureFooter";
import NavMenu from "../../../layouts/headers/Menu/FutureNavMenu";
import LoginModal from "../../../modals/LoginModal";
import { useClientSession } from "../../../my-components/userclientsession";
import ContactArea from "./ContactArea";

const Contact = () => {
  const [loginModal, setLoginModal] = useState(false);
  const { session } = useClientSession();
  return (
    <>
      <NavMenu onLoginClick={() => setLoginModal(true)} session={session} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <ContactArea />
      <FutureFooter />
    </>
  );
};

export default Contact;
