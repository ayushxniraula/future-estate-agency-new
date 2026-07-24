import Wrapper from '../layouts/Wrapper';
import SEO from '../components/SEO';
import ListingDetailsTwoMain from '../components/ListingDetails/listing-details-2';

const ListingDetailsTwo = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'Listing Details'} />
         <ListingDetailsTwoMain />
      </Wrapper>
   );
};

export default ListingDetailsTwo;