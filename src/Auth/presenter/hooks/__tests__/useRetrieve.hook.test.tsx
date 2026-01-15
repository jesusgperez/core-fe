import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useRetrieve } from '../useRetrieve.hook'

const { mockNavigate, mockSetModalState } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSetModalState: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

vi.mock('../../injections', () => ({
  default: {
    AuthUseCase: {
      retrievePassword: vi.fn()
    }
  }
}))

vi.mock('../../contexts/Context', () => ({
  default: React.createContext({
    loginData: { email: '', password: '' },
    setLoginData: vi.fn(),
    modalState: { open: false, title: '', content: '' },
    setModalState: mockSetModalState
  })
}))

import injections from '../../injections'

describe('useRetrieve', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false
        }
      }
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return a mutation object', () => {
    const { result } = renderHook(() => useRetrieve(), { wrapper })

    expect(result.current).toHaveProperty('mutate')
    expect(result.current).toHaveProperty('mutateAsync')
    expect(result.current).toHaveProperty('isPending')
    expect(result.current).toHaveProperty('isSuccess')
    expect(result.current).toHaveProperty('isError')
  })

  it('should call retrievePassword with correct data on mutate', async () => {
    vi.mocked(injections.AuthUseCase.retrievePassword).mockResolvedValue(undefined)

    const { result } = renderHook(() => useRetrieve(), { wrapper })

    result.current.mutate({ email: 'test@example.com' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(injections.AuthUseCase.retrievePassword).toHaveBeenCalledWith({
      email: 'test@example.com'
    })
  })

  it('should show success modal with validity message on success', async () => {
    vi.mocked(injections.AuthUseCase.retrievePassword).mockResolvedValue(undefined)

    const { result } = renderHook(() => useRetrieve(), { wrapper })

    result.current.mutate({ email: 'test@example.com' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockSetModalState).toHaveBeenCalledWith({
      title: 'Éxito',
      content: 'En caso de existir la cuenta, se ha enviado un correo para recuperar la contraseña, tienes 5 minutos de validez',
      open: true
    })
  })

  it('should navigate to login on success', async () => {
    vi.mocked(injections.AuthUseCase.retrievePassword).mockResolvedValue(undefined)

    const { result } = renderHook(() => useRetrieve(), { wrapper })

    result.current.mutate({ email: 'test@example.com' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should show success modal even on error (for security - not revealing if email exists)', async () => {
    vi.mocked(injections.AuthUseCase.retrievePassword).mockRejectedValue(new Error('Not found'))

    const { result } = renderHook(() => useRetrieve(), { wrapper })

    result.current.mutate({ email: 'nonexistent@example.com' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // The hook shows success message even on error for security purposes
    expect(mockSetModalState).toHaveBeenCalledWith({
      title: 'Éxito',
      content: 'En caso de existir la cuenta, se ha enviado un correo para recuperar la contraseña',
      open: true
    })
  })

  it('should navigate to login even on error', async () => {
    vi.mocked(injections.AuthUseCase.retrievePassword).mockRejectedValue(new Error('Error'))

    const { result } = renderHook(() => useRetrieve(), { wrapper })

    result.current.mutate({ email: 'test@example.com' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useRetrieve(), { wrapper })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })
})
