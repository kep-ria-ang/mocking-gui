'use client';

import dynamic from 'next/dynamic';

import { mockingConfig } from '@/mocks/config';

import type { PropsWithChildren } from 'react';

const MockingGUIBoundary = dynamic(
  () =>
    import('@kakaocloud/mocking-gui/browser').then(({ MockingGUIBoundary }) => MockingGUIBoundary),
  {
    ssr: false,
  },
);

const ClientMockingDevTools = ({ children }: PropsWithChildren) => {
  return <MockingGUIBoundary config={mockingConfig}>{children}</MockingGUIBoundary>;
};

export default ClientMockingDevTools;
