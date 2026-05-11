import { BASE_ENDPOINT } from '@/constants/api';

import type { HandlerConfigOption } from '@kakaocloud/mocking-gui';

export const handlers: HandlerConfigOption[] = [
  {
    name: 'User API',
    url: `${BASE_ENDPOINT}/user/:username`,
    method: 'get',
    responseVariants: [
      {
        name: 'Success',
        status: 200,
        body: {
          id: '1',
          name: 'Ria Ang',
          role: 'User',
          features: ['Dashboard'],
        },
      },
      {
        name: 'Admin',
        status: 200,
        body: {
          id: '2',
          name: 'Admin User',
          role: 'Admin',
          features: ['Dashboard', 'Settings'],
        },
      },
      {
        name: 'Unauthorized',
        status: 401,
        body: { error: 'Unauthorized' },
      },
    ],
  },
  {
    name: 'Get User Report',
    description: 'Raw body response examples',
    url: `${BASE_ENDPOINT}/user/:username/report`,
    method: 'get',
    responseVariants: [
      {
        name: 'Text',
        status: 200,
        rawBody: {
          kind: 'text',
          value: "User report for 'ria' (role=ADMIN)",
        },
      },
      {
        name: 'HTML',
        status: 200,
        rawBody: {
          kind: 'html',
          value: '<h1>User Report</h1><p>Username: Ria</p>',
        },
      },
      {
        name: 'XML',
        status: 200,
        rawBody: {
          kind: 'html',
          value: '<user><name>Ria</name><role>Admin</role></user>',
        },
      },
    ],
  },
];
