import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TagList from './TagList'

describe('TagList', () => {
  it('should render tags', () => {
    const tags = [{ id: '1', name: 'React' }, { id: '2', name: 'Next.js' }]
    render(<TagList tags={tags} />)
    
    expect(screen.getByText('React')).toBeDefined()
    expect(screen.getByText('Next.js')).toBeDefined()
  })

  it('should render nothing when no tags', () => {
    const { container } = render(<TagList tags={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
