import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '../Select'

vi.mock('react-icons/bi', () => ({
  BiChevronDown: () => <span data-testid="chevron-icon">chevron</span>
}))

vi.mock('react-icons/ci', () => ({
  CiSearch: () => <span data-testid="search-icon">search</span>
}))

const mockDataList = [
  { name: 'Apple', tag: 'apple' },
  { name: 'Banana', tag: 'banana' },
  { name: 'Cherry', tag: 'cherry' },
  { name: 'Date', tag: 'date' }
]

describe('Select', () => {
  it('should render with placeholder', () => {
    render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
      />
    )

    expect(screen.getByText('Select a fruit')).toBeInTheDocument()
  })

  it('should show dropdown when clicked', () => {
    render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
      />
    )

    const selectTrigger = screen.getByText('Select a fruit')
    fireEvent.click(selectTrigger)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Cherry')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
  })

  it('should hide dropdown initially', () => {
    const { container } = render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
      />
    )

    const dropdown = container.querySelector('ul')
    expect(dropdown).toHaveClass('hidden')
  })

  it('should select an item when clicked', () => {
    const { container } = render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
      />
    )

    fireEvent.click(screen.getByText('Select a fruit'))

    const appleListItem = screen.getByText('Apple').closest('li') as Element
    fireEvent.click(appleListItem)

    const topItem = container.querySelector('.flex.flex-col > div')
    expect(topItem).toHaveTextContent('Apple')
  })

  it('should call setSelectedOuter when item is selected', () => {
    const setSelectedOuter = vi.fn()
    const selectedOuter = new Set<string>()

    render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
        selectedOuter={selectedOuter}
        setSelectedOuter={setSelectedOuter}
      />
    )

    fireEvent.click(screen.getByText('Select a fruit'))

    const bananaListItem = screen.getByText('Banana').closest('li') as Element
    fireEvent.click(bananaListItem)

    expect(setSelectedOuter).toHaveBeenCalled()
  })

  it('should deselect item when clicking it again', () => {
    const { container } = render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
      />
    )

    fireEvent.click(screen.getByText('Select a fruit'))

    const appleListItem = screen.getByText('Apple').closest('li') as Element
    fireEvent.click(appleListItem)

    const topItem = container.querySelector('.flex.flex-col > div')
    fireEvent.click(topItem as Element)

    fireEvent.click(appleListItem)

    expect(screen.getByText('Select a fruit')).toBeInTheDocument()
  })

  it('should filter items based on search', () => {
    render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
      />
    )

    fireEvent.click(screen.getByText('Select a fruit'))

    const searchInput = screen.getByPlaceholderText('Buscar')
    fireEvent.change(searchInput, { target: { value: 'app' } })

    const appleItem = screen.getByText('Apple').closest('li')
    const bananaItem = screen.getByText('Banana').closest('li')

    expect(appleItem).not.toHaveClass('hidden')
    expect(bananaItem).toHaveClass('hidden')
  })

  it('should display error message when hasError is true', () => {
    render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
        errors={{ hasError: true, message: 'Please select a fruit' }}
      />
    )

    expect(screen.getByText('Please select a fruit')).toBeInTheDocument()
    expect(screen.getByText('Please select a fruit')).not.toHaveClass('hidden')
  })

  it('should hide error message when hasError is false', () => {
    render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
        errors={{ hasError: false, message: 'Please select a fruit' }}
      />
    )

    const errorElement = screen.getByText('Please select a fruit')
    expect(errorElement).toHaveClass('hidden')
  })

  it('should apply container styles', () => {
    const { container } = render(
      <Select
        dataList={mockDataList}
        placeholder="Select a fruit"
        containerStyles="w-full"
      />
    )

    const containerDiv = container.firstChild
    expect(containerDiv).toHaveClass('w-full')
  })

  describe('multiple selection mode', () => {
    it('should show multiple selection hint', () => {
      render(
        <Select
          dataList={mockDataList}
          placeholder="Select fruits"
          multiple={true}
        />
      )

      expect(screen.getByText('*Seleciona varios')).toBeInTheDocument()
    })

    it('should show close button when dropdown is open', () => {
      render(
        <Select
          dataList={mockDataList}
          placeholder="Select fruits"
          multiple={true}
        />
      )

      fireEvent.click(screen.getByText('Select fruits'))

      expect(screen.getByText('Cerrar')).toBeInTheDocument()
    })

    it('should close dropdown when clicking close button', () => {
      const { container } = render(
        <Select
          dataList={mockDataList}
          placeholder="Select fruits"
          multiple={true}
        />
      )

      fireEvent.click(screen.getByText('Select fruits'))
      fireEvent.click(screen.getByText('Cerrar'))

      const dropdown = container.querySelector('ul')
      expect(dropdown).toHaveClass('hidden')
    })

    it('should allow selecting multiple items', () => {
      render(
        <Select
          dataList={mockDataList}
          placeholder="Select fruits"
          multiple={true}
        />
      )

      fireEvent.click(screen.getByText('Select fruits'))
      fireEvent.click(screen.getByText('Apple'))
      fireEvent.click(screen.getByText('Banana'))

      expect(screen.getByText('Apple, Banana')).toBeInTheDocument()
    })

    it('should remove item from selection when clicking it again in multiple mode', () => {
      const { container } = render(
        <Select
          dataList={mockDataList}
          placeholder="Select fruits"
          multiple={true}
        />
      )

      fireEvent.click(screen.getByText('Select fruits'))

      const appleListItem = screen.getByText('Apple').closest('li') as Element
      const bananaListItem = screen.getByText('Banana').closest('li') as Element

      fireEvent.click(appleListItem)
      fireEvent.click(bananaListItem)

      expect(screen.getByText('Apple, Banana')).toBeInTheDocument()

      fireEvent.click(appleListItem)

      expect(screen.queryByText('Apple, Banana')).not.toBeInTheDocument()

      const topItem = container.querySelector('.flex.flex-col > div')
      expect(topItem).toHaveTextContent('Banana')
    })
  })

  describe('name truncation', () => {
    it('should truncate long names', () => {
      const longNameList = [
        { name: 'This is a very long fruit name that should be truncated', tag: 'long' }
      ]

      render(
        <Select
          dataList={longNameList}
          placeholder="Select a fruit"
        />
      )

      fireEvent.click(screen.getByText('Select a fruit'))
      fireEvent.click(screen.getByText('This is a very long fruit name that should be truncated'))

      expect(screen.getByText('This is a very long ...'))
    })
  })
})
