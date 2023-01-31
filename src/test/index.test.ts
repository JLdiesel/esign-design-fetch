import { ServiceInsance } from '../instence'
import { describe, it, expect } from 'vitest'
describe('test1', () => {
  const service = new ServiceInsance({ timeout: 3000 })
  it('get', async () => {
    const res = await service.get('http://localhost:3000/list')
    expect(res.data).toMatchSnapshot()
  })
})
