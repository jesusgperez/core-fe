import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckBoxGroup } from '../CheckBoxGroup'

const mockOptions = [
  { name: 'Option 1', tag: 'opt1' },
  { name: 'Option 2', tag: 'opt2' },
  { name: 'Option 3', tag: 'opt3' }
]

describe('CheckBoxGroup', () => {
  it('should render all options', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
      />
    )

    expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
  })

  it('should render with title', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
      />
    )

    expect(screen.getByText('Select option')).toBeInTheDocument()
  })

  it('should hide title when empty', () => {
    render(
      <CheckBoxGroup
        title=""
        options={mockOptions}
      />
    )

    const titleElement = document.querySelector('h3')
    expect(titleElement).toHaveClass('hidden')
  })

  it('should have all checkboxes unchecked by default', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it('should select an option when clicked', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
      />
    )

    const firstCheckbox = screen.getByLabelText('Option 1')
    fireEvent.click(firstCheckbox)

    expect(firstCheckbox).toBeChecked()
  })

  it('should only allow one option to be selected at a time', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
      />
    )

    const firstCheckbox = screen.getByLabelText('Option 1')
    const secondCheckbox = screen.getByLabelText('Option 2')

    fireEvent.click(firstCheckbox)
    expect(firstCheckbox).toBeChecked()
    expect(secondCheckbox).not.toBeChecked()

    fireEvent.click(secondCheckbox)
    expect(firstCheckbox).not.toBeChecked()
    expect(secondCheckbox).toBeChecked()
  })

  it('should deselect when clicking the same option again', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
      />
    )

    const firstCheckbox = screen.getByLabelText('Option 1')

    fireEvent.click(firstCheckbox)
    expect(firstCheckbox).toBeChecked()

    fireEvent.click(firstCheckbox)
    expect(firstCheckbox).not.toBeChecked()
  })

  it('should call setOuterChecked with tag when option is selected', () => {
    const setOuterChecked = vi.fn()
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
        setOuterChecked={setOuterChecked}
      />
    )

    fireEvent.click(screen.getByLabelText('Option 2'))

    expect(setOuterChecked).toHaveBeenCalledWith('opt2')
  })

  it('should call setOuterChecked with empty string when option is deselected', () => {
    const setOuterChecked = vi.fn()
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
        setOuterChecked={setOuterChecked}
      />
    )

    const firstCheckbox = screen.getByLabelText('Option 1')

    fireEvent.click(firstCheckbox)
    expect(setOuterChecked).toHaveBeenCalledWith('opt1')

    fireEvent.click(firstCheckbox)
    expect(setOuterChecked).toHaveBeenCalledWith('')
  })

  it('should not display error message when no errors', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
      />
    )

    const errorElement = document.querySelector('.text-red-500')
    expect(errorElement).toHaveClass('hidden')
  })

  it('should display error message when hasError is true', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
        errors={{ hasError: true, message: 'Please select an option' }}
      />
    )

    expect(screen.getByText('Please select an option')).toBeInTheDocument()
    expect(screen.getByText('Please select an option')).not.toHaveClass('hidden')
  })

  it('should hide error message when hasError is false', () => {
    render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
        errors={{ hasError: false, message: 'Please select an option' }}
      />
    )

    const errorElement = screen.getByText('Please select an option')
    expect(errorElement).toHaveClass('hidden')
  })

  it('should apply container styles', () => {
    const { container } = render(
      <CheckBoxGroup
        title="Select option"
        options={mockOptions}
        containerStyles="w-full"
      />
    )

    const containerDiv = container.firstChild
    expect(containerDiv).toHaveClass('w-full')
  })
})
