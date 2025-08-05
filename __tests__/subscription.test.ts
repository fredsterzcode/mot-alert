import { getPlanFeatures, getPlanLimits, getPlanPrice } from '../lib/utils'

describe('Subscription Plan Logic', () => {
  describe('getPlanFeatures', () => {
    it('should return correct features for DRIVER_FREE plan', () => {
      const features = getPlanFeatures('DRIVER_FREE')
      
      expect(features.reminders).toEqual(['MOT'])
      expect(features.channels).toEqual(['EMAIL'])
      expect(features.vehicles).toBe(1)
      expect(features.ads).toBe(true)
      expect(features.customSchedules).toBe(false)
      expect(features.prioritySupport).toBe(false)
    })

    it('should return correct features for DRIVER_PREMIUM plan', () => {
      const features = getPlanFeatures('DRIVER_PREMIUM')
      
      expect(features.reminders).toEqual(['MOT', 'TAX', 'INSURANCE', 'SERVICE'])
      expect(features.channels).toEqual(['EMAIL', 'SMS'])
      expect(features.vehicles).toBe(3)
      expect(features.ads).toBe(false)
      expect(features.customSchedules).toBe(true)
      expect(features.prioritySupport).toBe(true)
    })

    it('should return correct features for GARAGE_STARTER plan', () => {
      const features = getPlanFeatures('GARAGE_STARTER')
      
      expect(features.reminders).toEqual(['MOT'])
      expect(features.channels).toEqual(['EMAIL', 'SMS'])
      expect(features.vehicles).toBe(null)
      expect(features.ads).toBe(false)
      expect(features.customSchedules).toBe(true)
      expect(features.prioritySupport).toBe(false)
    })
  })

  describe('getPlanLimits', () => {
    it('should return null for unlimited plans', () => {
      expect(getPlanLimits('DRIVER_FREE')).toBe(null)
      expect(getPlanLimits('DRIVER_PREMIUM')).toBe(null)
      expect(getPlanLimits('GARAGE_PREMIUM')).toBe(null)
    })

    it('should return correct limits for limited plans', () => {
      expect(getPlanLimits('GARAGE_STARTER')).toBe(100)
      expect(getPlanLimits('GARAGE_PRO')).toBe(500)
    })

    it('should return default limit for unknown plans', () => {
      expect(getPlanLimits('UNKNOWN_PLAN')).toBe(100)
    })
  })

  describe('getPlanPrice', () => {
    it('should return correct prices for driver plans', () => {
      expect(getPlanPrice('DRIVER_FREE')).toBe(0)
      expect(getPlanPrice('DRIVER_PREMIUM')).toBe(1.99)
      expect(getPlanPrice('DRIVER_PREMIUM_ANNUAL')).toBe(19.99)
    })

    it('should return correct prices for garage plans', () => {
      expect(getPlanPrice('GARAGE_STARTER')).toBe(15)
      expect(getPlanPrice('GARAGE_PRO')).toBe(45)
      expect(getPlanPrice('GARAGE_PREMIUM')).toBe(99)
    })

    it('should return 0 for unknown plans', () => {
      expect(getPlanPrice('UNKNOWN_PLAN')).toBe(0)
    })
  })
})

describe('Subscription Validation', () => {
  it('should allow free tier drivers to have unlimited reminders', () => {
    const features = getPlanFeatures('DRIVER_FREE')
    const limit = getPlanLimits('DRIVER_FREE')
    
    expect(limit).toBe(null) // Unlimited
    expect(features.channels).toContain('EMAIL')
    expect(features.channels).not.toContain('SMS')
  })

  it('should allow premium tier drivers to have unlimited reminders with SMS', () => {
    const features = getPlanFeatures('DRIVER_PREMIUM')
    const limit = getPlanLimits('DRIVER_PREMIUM')
    
    expect(limit).toBe(null) // Unlimited
    expect(features.channels).toContain('EMAIL')
    expect(features.channels).toContain('SMS')
    expect(features.ads).toBe(false)
  })

  it('should enforce vehicle limits correctly', () => {
    const freeFeatures = getPlanFeatures('DRIVER_FREE')
    const premiumFeatures = getPlanFeatures('DRIVER_PREMIUM')
    
    expect(freeFeatures.vehicles).toBe(1)
    expect(premiumFeatures.vehicles).toBe(3)
  })
}) 