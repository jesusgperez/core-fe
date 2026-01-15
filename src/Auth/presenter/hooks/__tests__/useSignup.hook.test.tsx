import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useSignup } from '../useSignup.hook'

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
      signupUser: vi.fn()
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

describe('useSignup', () => {
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
    const { result } = renderHook(() => useSignup(), { wrapper })

    expect(result.current).toHaveProperty('mutate')
    expect(result.current).toHaveProperty('mutateAsync')
    expect(result.current).toHaveProperty('isPending')
    expect(result.current).toHaveProperty('isSuccess')
    expect(result.current).toHaveProperty('isError')
  })

  it('should call signupUser with correct data on mutate', async () => {
    const signupData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordRepeat: 'password123'
    }

    vi.mocked(injections.AuthUseCase.signupUser).mockResolvedValue(signupData)

    const { result } = renderHook(() => useSignup(), { wrapper })

    result.current.mutate(signupData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(injections.AuthUseCase.signupUser).toHaveBeenCalledWith(signupData)
  })

  it('should show success modal with user name on successful signup', async () => {
    const signupData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordRepeat: 'password123'
    }

    vi.mocked(injections.AuthUseCase.signupUser).mockResolvedValue(signupData)

    const { result } = renderHook(() => useSignup(), { wrapper })

    result.current.mutate(signupData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockSetModalState).toHaveBeenCalledWith({
      title: '¡Éxito!',
      content: 'Usuario John Doe has sido creado correctamente',
      open: true
    })
  })

  it('should navigate to login on successful signup', async () => {
    const signupData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      passwordRepeat: 'password123'
    }

    vi.mocked(injections.AuthUseCase.signupUser).mockResolvedValue(signupData)

    const { result } = renderHook(() => useSignup(), { wrapper })

    result.current.mutate(signupData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should show error modal on signup failure', async () => {
    const mockError = { detail: 'Email already exists' }
    vi.mocked(injections.AuthUseCase.signupUser).mockRejectedValue(mockError)

    const signupData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
      password: 'password123',
      passwordRepeat: 'password123'
    }

    const { result } = renderHook(() => useSignup(), { wrapper })

    result.current.mutate(signupData)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockSetModalState).toHaveBeenCalledWith({
      title: 'Error',
      content: 'Email already exists',
      open: true
    })
  })

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useSignup(), { wrapper })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })
})
