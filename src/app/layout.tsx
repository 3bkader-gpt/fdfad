import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a root `middleware.ts` that handles redirections
// to localized paths, this component can just render the children.
export default function RootLayout({ children }: Props) {
  return children;
}
