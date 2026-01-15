import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('should render the button with the provided text', () => {
    const onClick = vi.fn()
    render(<Button text="Click me" onClick={onClick} />)

    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should call onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button text="Click me" onClick={onClick} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should apply custom styles', () => {
    const onClick = vi.fn()
    render(<Button text="Click me" onClick={onClick} customStyles="bg-blue-500" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-500')
  })

  it('should be enabled by default', () => {
    const onClick = vi.fn()
    render(<Button text="Click me" onClick={onClick} />)

    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('should be disabled when enabled prop is false', () => {
    const onClick = vi.fn()
    render(<Button text="Click me" onClick={onClick} enabled={false} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should be enabled when enabled prop is true', () => {
    const onClick = vi.fn()
    render(<Button text="Click me" onClick={onClick} enabled={true} />)

    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('should not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<Button text="Click me" onClick={onClick} enabled={false} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })
})
