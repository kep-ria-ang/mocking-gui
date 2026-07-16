import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { generateNormalizedUrl, normalizePathParams } from './pathParams';

describe('normalizePathParams', () => {
  it('converts a simple brace param to a colon param', () => {
    expect(normalizePathParams('/v1/kubeflows/{id}')).toBe('/v1/kubeflows/:id');
  });

  it('converts a kebab-case brace param to a camelCase colon param', () => {
    expect(normalizePathParams('/v1/kubeflows/{kubeflow-id}')).toBe('/v1/kubeflows/:kubeflowId');
  });

  it('converts multiple kebab-case params in one path', () => {
    expect(normalizePathParams('/v1/kubeflows/{kubeflow-id}/groups/{group-name}')).toBe(
      '/v1/kubeflows/:kubeflowId/groups/:groupName',
    );
  });

  it('leaves an already-safe camelCase param unchanged', () => {
    expect(normalizePathParams('/v1/kubeflows/{kubeflowId}')).toBe('/v1/kubeflows/:kubeflowId');
  });

  it('produces a route that MSW can actually match against a real request', async () => {
    const route = 'https://example.com' + normalizePathParams('/v1/kubeflows/{kubeflow-id}/groups/{group-name}');
    const handler = http.delete(route, ({ params }) => HttpResponse.json(params));

    const result = await handler.run({
      request: new Request(
        'https://example.com/v1/kubeflows/a1f0c3d2-0001-4b2a-9c1e-1a2b3c4d0001/groups/ml-research-team',
        { method: 'DELETE' },
      ),
      requestId: 'test-request-id',
    });

    expect(result).not.toBeNull();
    expect(await result?.response?.json()).toEqual({
      kubeflowId: 'a1f0c3d2-0001-4b2a-9c1e-1a2b3c4d0001',
      groupName: 'ml-research-team',
    });
  });
});

describe('generateNormalizedUrl', () => {
  it('masks already-normalized colon params by index', () => {
    expect(
      generateNormalizedUrl('https://example.com/v1/kubeflows/:kubeflowId/groups/:groupName'),
    ).toBe('https://example.com/v1/kubeflows/:param1/groups/:param2');
  });
});
