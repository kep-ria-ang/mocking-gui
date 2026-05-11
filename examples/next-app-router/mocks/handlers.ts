import { BASE_ENDPOINT } from '@/constants/api';

import type { HandlerConfigOption } from '@kakaocloud/mocking-gui';

export const handlers: HandlerConfigOption[] = [
  {
    name: 'Get User Resources',
    description: 'Successful response',
    url: `${BASE_ENDPOINT}/user/:username`,
    method: 'get',
    responseVariants: [
      {
        name: 'Success',
        status: 200,
        headers: {
          'x-custom-header': 'custom-value',
        },
        body: {
          id: '123',
          name: 'Ria',
          role: 'Admin',
          features: ['Dashboard', 'Settings'],
        },
      },
      {
        name: 'Error',
        headers: {
          'x-custom-header': 'custom-value',
        },
        status: 400,
        body: {
          error: 'Invalid username',
        },
      },
    ],
    responseVariantsFn: () => {
      return { name: 'Success', status: 200 };
    },
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
          value: 'username=Ria&role=Admin',
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
          kind: 'xml',
          value: '<user><name>Ria</name><role>Admin</role></user>',
        },
      },
    ],
  },
];
