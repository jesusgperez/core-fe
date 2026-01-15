import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input', () => {
  it('should render with placeholder', () => {
    const setValue = vi.fn()
    render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
      />
    )

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should display the current value', () => {
    const setValue = vi.fn()
    render(
      <Input
        value="test value"
        setValue={setValue}
        placeholder="Enter text"
      />
    )

    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('should call setValue when input changes', () => {
    const setValue = vi.fn()
    render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Enter text'), {
      target: { value: 'new value' }
    })

    expect(setValue).toHaveBeenCalledWith('new value')
  })

  it('should render with text type by default', () => {
    const setValue = vi.fn()
    render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
      />
    )

    expect(screen.getByPlaceholderText('Enter text')).toHaveAttribute('type', 'text')
  })

  it('should render with specified type', () => {
    const setValue = vi.fn()
    render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter password"
        type="password"
      />
    )

    expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'password')
  })

  it('should not display error message when no errors', () => {
    const setValue = vi.fn()
    const { container } = render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
      />
    )

    const errorElement = container.querySelector('p.text-red-500')
    expect(errorElement).toHaveClass('hidden')
  })

  it('should display error message when hasError is true', () => {
    const setValue = vi.fn()
    render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
        errors={{ hasError: true, message: 'This field is required' }}
      />
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).not.toHaveClass('hidden')
  })

  it('should hide error message when hasError is false', () => {
    const setValue = vi.fn()
    render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
        errors={{ hasError: false, message: 'This field is required' }}
      />
    )

    const errorElement = screen.getByText('This field is required')
    expect(errorElement).toHaveClass('hidden')
  })

  it('should apply custom styles', () => {
    const setValue = vi.fn()
    render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
        customStyles="bg-gray-100"
      />
    )

    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('bg-gray-100')
  })

  it('should apply container styles', () => {
    const setValue = vi.fn()
    const { container } = render(
      <Input
        value=""
        setValue={setValue}
        placeholder="Enter text"
        containerStyles="mt-4"
      />
    )

    const containerDiv = container.firstChild
    expect(containerDiv).toHaveClass('mt-4')
  })
})
