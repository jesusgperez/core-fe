import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckBox } from '../CheckBox'

describe('CheckBox', () => {
  it('should render with title', () => {
    render(<CheckBox id="test" title="Accept terms" />)

    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
  })

  it('should render unchecked by default', () => {
    render(<CheckBox id="test" title="Accept terms" />)

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should toggle checked state when clicked', () => {
    render(<CheckBox id="test" title="Accept terms" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('should call setOuterCheck when provided and checkbox is clicked', () => {
    const setOuterCheck = vi.fn()
    render(
      <CheckBox
        id="test"
        title="Accept terms"
        setOuterCheck={setOuterCheck}
      />
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(setOuterCheck).toHaveBeenCalledWith(true)
  })

  it('should call setOuterCheck with false when unchecking', () => {
    const setOuterCheck = vi.fn()
    render(
      <CheckBox
        id="test"
        title="Accept terms"
        setOuterCheck={setOuterCheck}
      />
    )

    const checkbox = screen.getByRole('checkbox')

    fireEvent.click(checkbox)
    expect(setOuterCheck).toHaveBeenCalledWith(true)

    fireEvent.click(checkbox)
    expect(setOuterCheck).toHaveBeenCalledWith(false)
  })

  it('should not display error message when no errors', () => {
    render(<CheckBox id="test" title="Accept terms" />)

    const errorElement = document.querySelector('.text-red-500')
    expect(errorElement).toHaveClass('hidden')
  })

  it('should display error message when hasError is true', () => {
    render(
      <CheckBox
        id="test"
        title="Accept terms"
        errors={{ hasError: true, message: 'You must accept the terms' }}
      />
    )

    expect(screen.getByText('You must accept the terms')).toBeInTheDocument()
    expect(screen.getByText('You must accept the terms')).not.toHaveClass('hidden')
  })

  it('should hide error message when hasError is false', () => {
    render(
      <CheckBox
        id="test"
        title="Accept terms"
        errors={{ hasError: false, message: 'You must accept the terms' }}
      />
    )

    const errorElement = screen.getByText('You must accept the terms')
    expect(errorElement).toHaveClass('hidden')
  })

  it('should apply container styles', () => {
    const { container } = render(
      <CheckBox
        id="test"
        title="Accept terms"
        containerStyle="mt-4"
      />
    )

    const containerDiv = container.firstChild
    expect(containerDiv).toHaveClass('mt-4')
  })

  it('should have correct id for checkbox and label association', () => {
    render(<CheckBox id="terms" title="Accept terms" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('id', 'checkbox-terms')

    const label = screen.getByText('Accept terms')
    expect(label).toHaveAttribute('for', 'checkbox-terms')
  })
})
