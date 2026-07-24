import Wrapper from '../layouts/Wrapper';
import SEO from '../components/SEO';
import BlogTwoMain from '../components/blogs/blog-two'

const BlogTwo = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'Blog'} />
         <BlogTwoMain />
      </Wrapper>
   );
};

export default BlogTwo;