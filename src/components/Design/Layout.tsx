import Footer from './Footer';
import Header from './Header';
import { ScrollContext } from 'gatsby-react-router-scroll';

import type { PageProps } from 'gatsby';

export interface LayoutProps {
  children?: React.ReactNode;
  location: PageProps['location'];
}

export default function Layout({ children, location }: LayoutProps) {
  return (
    <ScrollContext location={location}>
      <div className="page-layout-container">
        <Header />

        <main>{children}</main>

        <Footer />
      </div>
    </ScrollContext>
  );
}
