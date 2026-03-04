import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Search from './Search'

describe('Search', () => {
  it('should render the search input', () => {
    render(<Search onSearch={() => {}} />)
    expect(screen.getByPlaceholderText('Search posts...')).toBeDefined()
  })

  it('should call onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)
    
    const input = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(input, { target: { value: 'React' } })
    
    expect(onSearch).toHaveBeenCalledWith('React')
  })

  it('should clear search when clear button is clicked', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)
    
    const input = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(input, { target: { value: 'React' } })
    
    const clearButton = screen.getByLabelText('Clear search')
    fireEvent.click(clearButton)
    
    expect(input).toHaveValue('')
    expect(onSearch).toHaveBeenCalledWith('')
  })
})
