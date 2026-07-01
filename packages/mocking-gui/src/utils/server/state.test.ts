import { describe, it, expect, vi } from 'vitest'

import { HandlerType } from '../../types/handler'
import { reconstructHandlerConfigsFromCookie } from './state'

import type { StoredHandlerVariants } from '../../types/handler'


/**
 * Server-side state reconstruction tests
 * Validates: multi-cookie reading, error handling, SSR state consistency
 */

describe('reconstructHandlerConfigsFromCookie', () => {
  const baseConfigs: Record<string, StoredHandlerVariants> = {
    'GET./users': {
      active: false,
      type: HandlerType.MANUAL,
      variant: '200-default',
    },
  }

  describe('Single Cookie Support (backward compatibility)', () => {
    it('should reconstruct state from single cookie', () => {
      const syncData = JSON.stringify([
        ['GET./users', 'M', '200-success'],
        ['POST./users', 'A', '201-created'],
      ])
      const encoded = encodeURIComponent(syncData)
      const cookieString = `mocking_gui_sync=${encoded}`

      const result = reconstructHandlerConfigsFromCookie(cookieString, baseConfigs)

      expect(result['GET./users']).toEqual({
        active: true,
        type: HandlerType.MANUAL,
        variant: '200-success',
      })
      expect(result['POST./users']).toEqual({
        active: true,
        type: HandlerType.AUTO,
        variant: '201-created',
      })
    })

    it('should handle missing cookie gracefully', () => {
      const cookieString = 'other_cookie=value'
      const result = reconstructHandlerConfigsFromCookie(cookieString, baseConfigs)

      expect(result).toEqual(baseConfigs)
    })

    it('should merge with base configs', () => {
      const syncData = JSON.stringify([['GET./users', 'M', '400-error']])
      const encoded = encodeURIComponent(syncData)
      const cookieString = `mocking_gui_sync=${encoded}`

      const result = reconstructHandlerConfigsFromCookie(cookieString, baseConfigs)

      // Synced config
      expect(result['GET./users'].variant).toBe('400-error')

      // Base config preserved
      expect(result['GET./users'].active).toBe(true)
    })
  })

  describe('Multi-Cookie Support (NEW)', () => {
    it('should reconstruct state from multiple cookies', () => {
      // Simulate: Full JSON array split across multiple cookies
      // This matches the actual syncMultiCookie behavior
      const fullData = JSON.stringify([
        ['GET./api-1', 'M', '200'],
        ['GET./api-2', 'M', '200'],
        ['GET./api-3', 'M', '200'],
        ['GET./api-4', 'M', '200'],
      ])
      const encoded = encodeURIComponent(fullData)

      // Simulate splitting at 50 chars per cookie (for testing, normally 3000)
      const part1 = encoded.substring(0, 50)
      const part2 = encoded.substring(50)

      // Verify: Parts are valid when concatenated
      expect(part1 + part2).toBe(encoded)

      // Simulate: mocking_gui_sync_0 and mocking_gui_sync_1 cookies
      const cookieString = `mocking_gui_sync_0=${part1}; mocking_gui_sync_1=${part2}`

      const result = reconstructHandlerConfigsFromCookie(cookieString, {})

      // Verify: All handlers reconstructed (because parts are concatenated correctly)
      expect(result['GET./api-1']).toBeDefined()
      expect(result['GET./api-2']).toBeDefined()
      expect(result['GET./api-3']).toBeDefined()
      expect(result['GET./api-4']).toBeDefined()
    })

    it('should handle mixed single and multi-cookies (fallback)', () => {
      // When single cookie exists, multi-cookie should be ignored
      const singleData = JSON.stringify([['GET./users', 'M', '200']])
      const singleEncoded = encodeURIComponent(singleData)

      const multiData = JSON.stringify([['GET./other', 'M', '200']])
      const multiEncoded = encodeURIComponent(multiData)

      const cookieString = `mocking_gui_sync=${singleEncoded}; mocking_gui_sync_0=${multiEncoded}`

      const result = reconstructHandlerConfigsFromCookie(cookieString, {})

      // Should use single cookie (preferred over multi-cookie)
      expect(result['GET./users']).toBeDefined()
      // Multi-cookie should NOT be used (single cookie takes precedence)
      expect(result['GET./other']).toBeUndefined()
    })
  })

  describe('Type Handling', () => {
    it('should correctly map type characters', () => {
      const syncData = JSON.stringify([
        ['handler1', 'M', 'variant1'], // Manual
        ['handler2', 'A', 'variant2'], // Auto
        ['handler3', 'S', 'variant3'], // Swagger
        ['handler4', 'X', 'variant4'], // Unknown (default to Swagger)
      ])
      const encoded = encodeURIComponent(syncData)
      const cookieString = `mocking_gui_sync=${encoded}`

      const result = reconstructHandlerConfigsFromCookie(cookieString)

      expect(result['handler1'].type).toBe(HandlerType.MANUAL)
      expect(result['handler2'].type).toBe(HandlerType.AUTO)
      expect(result['handler3'].type).toBe(HandlerType.SWAGGER)
      expect(result['handler4'].type).toBe(HandlerType.SWAGGER) // Unknown defaults to SWAGGER
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const cookieString = `mocking_gui_sync=${encodeURIComponent('invalid json')}`
      const result = reconstructHandlerConfigsFromCookie(cookieString, baseConfigs)

      // Should return base configs on error
      expect(result).toEqual(baseConfigs)

      // Should log error
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse'),
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle corrupted cookie gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Simulate corrupted data
      const cookieString = `mocking_gui_sync=%FF%FE%FD` // Invalid UTF-8 sequences

      const result = reconstructHandlerConfigsFromCookie(cookieString, baseConfigs)

      // Should return base configs (not crash)
      expect(result).toBeDefined()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should validate entries before processing', () => {
      const syncData = JSON.stringify([
        ['valid_key', 'M', 'variant'],
        [null, 'M', 'variant'], // Invalid: null key
        ['valid_key2', null, 'variant'], // Invalid: null type
      ])
      const encoded = encodeURIComponent(syncData)
      const cookieString = `mocking_gui_sync=${encoded}`

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = reconstructHandlerConfigsFromCookie(cookieString, baseConfigs)

      // Should skip invalid entries with warning
      expect(result['valid_key']).toBeDefined()
      expect(result['valid_key2']).toBeUndefined() // Skipped due to null type

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('SSR Integration', () => {
    it('should enable immediate SSR state consistency (no 300ms delay)', () => {
      // Simulate: State changes at t=0, SSR reads at t=50ms
      const syncData = JSON.stringify([['GET./users', 'M', 'new-variant']])
      const encoded = encodeURIComponent(syncData)
      const cookieString = `mocking_gui_sync=${encoded}`

      // This call should complete immediately (no debounce delay)
      const startTime = performance.now()
      const result = reconstructHandlerConfigsFromCookie(cookieString)
      const endTime = performance.now()

      // Verify: Complete in < 5ms (not waiting 300ms)
      expect(endTime - startTime).toBeLessThan(5)

      // Verify: Latest state is available
      expect(result['GET./users'].variant).toBe('new-variant')
    })

    it('should support 100+ handlers without overflow', () => {
      // Generate large state (100+ handlers)
      const entries = Array.from({ length: 100 }, (_, i) => [
        `GET./endpoint-${i}`,
        'M',
        `200-variant-${i}`,
      ])

      // Create full JSON and split at chunk boundary
      const fullData = JSON.stringify(entries)
      const encoded = encodeURIComponent(fullData)

      // Simulate splitting into multiple cookies
      // Use fixed chunk size (real code uses 3000 bytes)
      const chunkSize = 100
      const part1 = encoded.substring(0, chunkSize)
      const part2 = encoded.substring(chunkSize)

      const cookieString = `mocking_gui_sync_0=${part1}; mocking_gui_sync_1=${part2}`

      const result = reconstructHandlerConfigsFromCookie(cookieString)

      // Verify: All 100 handlers reconstructed
      for (let i = 0; i < 100; i++) {
        expect(result[`GET./endpoint-${i}`]).toBeDefined()
        expect(result[`GET./endpoint-${i}`].variant).toBe(`200-variant-${i}`)
      }
    })
  })

  describe('Logging and Observability', () => {
    it('should log success with handler count', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const syncData = JSON.stringify([
        ['handler1', 'M', 'variant1'],
        ['handler2', 'M', 'variant2'],
      ])
      const encoded = encodeURIComponent(syncData)
      const cookieString = `mocking_gui_sync=${encoded}`

      reconstructHandlerConfigsFromCookie(cookieString)

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Server-side state reconstructed'),
        expect.objectContaining({ count: 2 })
      )

      consoleSpy.mockRestore()
    })

    it('should indicate multi-cookie vs single-cookie source', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Multi-cookie data: large enough to indicate multi-cookie source
      const largeData = JSON.stringify(Array.from({ length: 100 }, (_, i) => [`h${i}`, 'M', 'v']))
      const encoded = encodeURIComponent(largeData)

      // Split at 2500 bytes to ensure source indicator says 'multi-cookie' (> 3000 chars check)
      // Actually, the source check is: syncData.length > 3000 ? 'multi-cookie' : 'single-cookie'
      // So for multi-cookie, we need syncData.length > 3000
      // Let's create data that when split and re-joined is > 3000 chars

      const chunkSize = 2000
      const part1 = encoded.substring(0, chunkSize)
      const part2 = encoded.substring(chunkSize)

      const fullReconstructed = part1 + part2 // This should be > 3000 for multi-cookie indicator
      expect(fullReconstructed.length).toBeGreaterThan(3000)

      const cookieString = `mocking_gui_sync_0=${part1}; mocking_gui_sync_1=${part2}`

      reconstructHandlerConfigsFromCookie(cookieString)

      const logCall = consoleSpy.mock.calls.find(call =>
        call[0]?.includes('Server-side state reconstructed')
      )

      // Verify log was called with source indicator
      expect(logCall).toBeDefined()
      expect(logCall?.[1]).toMatchObject(
        expect.objectContaining({ source: 'multi-cookie' })
      )

      consoleSpy.mockRestore()
    })
  })
})
