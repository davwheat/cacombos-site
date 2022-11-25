import { RouteComponentProps } from '@gatsbyjs/reach-router';
import { navigate } from 'gatsby';

export interface RedirectProps extends RouteComponentProps {
  to: string;
}

export default function Redirect({ to }: RedirectProps) {
  navigate(to, { replace: true });

  return null;
}
