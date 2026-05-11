import { handlers } from '@/mocks/handlers';

import type { MockingConfig } from '@kakaocloud/mocking-gui';

export const MockConfig: MockingConfig = {
  mocks: handlers,
  swagger: [
    // {
    //   name: 'Petstore',
    //   docsUrl: 'https://petstore3.swagger.io',
    //   configUrl: `${BASE_ENDPOINT}/openapi.json`,
    //   serverUrl: `${BASE_ENDPOINT}`,
    // },
    {
      name: 'Beyond BFF',
      configUrl: 'https://bff.kr-central-2.kakaocloud-stg.com/openapi.json',
      docsUrl: 'https://bff.kr-central-2.kakaocloud-stg.com/docs',
    },
  ],
};
