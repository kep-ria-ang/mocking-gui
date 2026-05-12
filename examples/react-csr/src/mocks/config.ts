import { BASE_ENDPOINT } from '@/constants/api';
import { handlers } from '@/mocks/handlers';

import type { MockingConfig } from '@kakaocloud/mocking-gui';

export const mockConfig: MockingConfig = {
  mocks: handlers,
  swagger: [
    {
      name: 'Petstore',
      docsUrl: 'https://petstore3.swagger.io',
      configUrl: `${BASE_ENDPOINT}/openapi.json`,
    },
  ],
};
