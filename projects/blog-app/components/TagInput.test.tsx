import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TagInput from './TagInput'

describe('TagInput', () => {
  it('should render initial tags', () => {
    const tags = ['React', 'Next.js']
    render(<TagInput tags={tags} onAddTag={() => {}} onRemoveTag={() => {}} />)
    
    expect(screen.getByText('React')).toBeDefined()
    expect(screen.getByText('Next.js')).toBeDefined()
  })

  it('should call onAddTag when Enter is pressed', () => {
    const onAddTag = vi.fn()
    render(<TagInput tags={[]} onAddTag={onAddTag} onRemoveTag={() => {}} />)
    
    const input = screen.getByPlaceholderText('Add a tag...')
    fireEvent.change(input, { target: { value: 'Typescript' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(onAddTag).toHaveBeenCalledWith('Typescript')
    expect(input).toHaveValue('')
  })

  it('should call onRemoveTag when a tag is clicked', () => {
    const onRemoveTag = vi.fn()
    render(<TagInput tags={['React']} onAddTag={() => {}} onRemoveTag={onRemoveTag} />)
    
    const removeButton = screen.getByLabelText('Remove React')
    fireEvent.click(removeButton)
    
    expect(onRemoveTag).toHaveBeenCalledWith('React')
  })
})
