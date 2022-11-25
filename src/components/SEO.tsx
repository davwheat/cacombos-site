import React from 'react';

export interface SEOProps {
  children?: React.ReactNode;
  pageName: string;
}

export function SEO({ children, pageName }: SEOProps) {
  return (
    <>
      <title>{pageName} | Mobile Combos</title>

      {children}
    </>
  );
}
