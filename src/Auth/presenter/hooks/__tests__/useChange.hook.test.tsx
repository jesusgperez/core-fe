import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useChange } from '../useChange.hook'

const { mockNavigate, mockSetModalState, mockParams } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSetModalState: vi.fn(),
  mockParams: { encrypted: 'encrypted-token-123' }
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams
}))

vi.mock('../../injections', () => ({
  default: {
    AuthUseCase: {
      changePassword: vi.fn()
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

describe('useChange', () => {
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
    const { result } = renderHook(() => useChange(), { wrapper })

    expect(result.current).toHaveProperty('mutate')
    expect(result.current).toHaveProperty('mutateAsync')
    expect(result.current).toHaveProperty('isPending')
    expect(result.current).toHaveProperty('isSuccess')
    expect(result.current).toHaveProperty('isError')
  })

  it('should call changePassword with correct data and encrypted param on mutate', async () => {
    const changeData = {
      code: '123456',
      password: 'newPassword123',
      passwordRepeat: 'newPassword123'
    }

    vi.mocked(injections.AuthUseCase.changePassword).mockResolvedValue(changeData)

    const { result } = renderHook(() => useChange(), { wrapper })

    result.current.mutate(changeData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(injections.AuthUseCase.changePassword).toHaveBeenCalledWith(
      changeData,
      'encrypted-token-123'
    )
  })

  it('should show success modal on successful password change', async () => {
    const changeData = {
      code: '123456',
      password: 'newPassword123',
      passwordRepeat: 'newPassword123'
    }

    vi.mocked(injections.AuthUseCase.changePassword).mockResolvedValue(changeData)

    const { result } = renderHook(() => useChange(), { wrapper })

    result.current.mutate(changeData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockSetModalState).toHaveBeenCalledWith({
      title: 'Éxito',
      content: 'La contraseña se ha cambiado correctamente, ahora puede iniciar sesión',
      open: true
    })
  })

  it('should navigate to login on successful password change', async () => {
    const changeData = {
      code: '123456',
      password: 'newPassword123',
      passwordRepeat: 'newPassword123'
    }

    vi.mocked(injections.AuthUseCase.changePassword).mockResolvedValue(changeData)

    const { result } = renderHook(() => useChange(), { wrapper })

    result.current.mutate(changeData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should show error modal on password change failure', async () => {
    const mockError = { detail: 'Invalid code or expired link' }
    vi.mocked(injections.AuthUseCase.changePassword).mockRejectedValue(mockError)

    const changeData = {
      code: 'wrong-code',
      password: 'newPassword123',
      passwordRepeat: 'newPassword123'
    }

    const { result } = renderHook(() => useChange(), { wrapper })

    result.current.mutate(changeData)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockSetModalState).toHaveBeenCalledWith({
      title: 'Error',
      content: 'Invalid code or expired link',
      open: true
    })
  })

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useChange(), { wrapper })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })
})
