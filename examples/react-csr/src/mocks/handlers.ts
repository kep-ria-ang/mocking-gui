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
];
