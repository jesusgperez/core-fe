import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../Modal'
import { ModalTypes } from '../models'

describe('Modal', () => {
  it('should render with title and content', () => {
    const onExit = vi.fn()
    render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
      />
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('This is the modal content')).toBeInTheDocument()
  })

  it('should be hidden when open is false', () => {
    const onExit = vi.fn()
    const { container } = render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={false}
        onExit={onExit}
      />
    )

    const modalOverlay = container.firstChild
    expect(modalOverlay).toHaveClass('hidden')
  })

  it('should be visible when open is true', () => {
    const onExit = vi.fn()
    const { container } = render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
      />
    )

    const modalOverlay = container.firstChild
    expect(modalOverlay).not.toHaveClass('hidden')
  })

  it('should call onExit when clicking the overlay', () => {
    const onExit = vi.fn()
    const { container } = render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
      />
    )

    const modalOverlay = container.firstChild as Element
    fireEvent.click(modalOverlay)

    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('should render exit button in base mode', () => {
    const onExit = vi.fn()
    render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
        type={ModalTypes.base}
      />
    )

    expect(screen.getByText('Salir')).toBeInTheDocument()
  })

  it('should call onExit when clicking exit button in base mode', () => {
    const onExit = vi.fn()
    render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
        type={ModalTypes.base}
      />
    )

    fireEvent.click(screen.getByText('Salir'))

    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('should render both exit and continue buttons in continue mode', () => {
    const onExit = vi.fn()
    const onContinue = vi.fn()
    render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
        onContinue={onContinue}
        type={ModalTypes.continue}
      />
    )

    expect(screen.getByText('Salir')).toBeInTheDocument()
    expect(screen.getByText('Continuar')).toBeInTheDocument()
  })

  it('should call onContinue when clicking continue button', () => {
    const onExit = vi.fn()
    const onContinue = vi.fn()
    render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
        onContinue={onContinue}
        type={ModalTypes.continue}
      />
    )

    fireEvent.click(screen.getByText('Continuar'))

    expect(onContinue).toHaveBeenCalledTimes(1)
  })

  it('should call onExit when clicking exit button in continue mode', () => {
    const onExit = vi.fn()
    const onContinue = vi.fn()
    render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
        onContinue={onContinue}
        type={ModalTypes.continue}
      />
    )

    fireEvent.click(screen.getByText('Salir'))

    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('should throw error when continue type is used without onContinue', () => {
    const onExit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(
        <Modal
          title="Test Modal"
          content="This is the modal content"
          open={true}
          onExit={onExit}
          type={ModalTypes.continue}
        />
      )
    }).toThrow('Should provide an onContinue function')

    consoleSpy.mockRestore()
  })

  it('should render exit action by default (no type specified)', () => {
    const onExit = vi.fn()
    render(
      <Modal
        title="Test Modal"
        content="This is the modal content"
        open={true}
        onExit={onExit}
      />
    )

    expect(screen.getByText('Salir')).toBeInTheDocument()
    expect(screen.queryByText('Continuar')).not.toBeInTheDocument()
  })
})
