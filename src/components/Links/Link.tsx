import React from 'react';

import { Link as GatsbyLink } from 'gatsby';

export interface ILinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  /**
   * If present, will force as internal/external. Otherwise will auto-detect.
   */
  internal?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

function isExternalLink(url: string): boolean {
  const regex = /^(https?:\/\/|mailto:)/;

  return !!url?.match(regex);
}

const Link = ({ href, children, className, internal, ...props }: ILinkProps) => {
  const linkProps = {
    className,
    css: {
      fontWeight: 700,
      textDecoration: 'underline',
    },
    ...props,
  };

  if (internal === false || (internal !== true && isExternalLink(href))) {
    return (
      <a href={href} rel="noopener" {...linkProps}>
        {children}
      </a>
    );
  }

  return (
    <GatsbyLink to={href} {...linkProps}>
      {children}
    </GatsbyLink>
  );
};

export default Link;
