import FutureFooter from "../../../layouts/footers/FutureFooter";
import FutureHeader from "../../../layouts/headers/FutureHeader";
import ContactArea from "./ContactArea";

const Contact = () => {
  return (
    <>
      <FutureHeader style_1={true} style_2={false} /> <ContactArea />
      <FutureFooter />
    </>
  );
};

export default Contact;
