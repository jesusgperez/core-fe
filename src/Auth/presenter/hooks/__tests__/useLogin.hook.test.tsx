import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useLogin } from '../useLogin.hook'

const { mockNavigate, mockSetUser, mockSetModalState } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSetUser: vi.fn(),
  mockSetModalState: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn()
}))

vi.mock('../../../../common/presenter/hooks', () => ({
  useLocalStorage: () => ({
    getStorage: vi.fn(),
    setStorage: vi.fn()
  })
}))

vi.mock('../../injections', () => ({
  default: {
    AuthUseCase: {
      loginUser: vi.fn()
    }
  }
}))

vi.mock('../../../../common/presenter/contexts/global', () => ({
  GlobalContext: React.createContext({
    user: { firstName: '', lastName: '', email: '', username: '' },
    setUser: mockSetUser
  })
}))

vi.mock('../../contexts/Context', () => ({
  default: React.createContext({
    loginData: { email: '', password: '' },
    setLoginData: vi.fn(),
    modalState: { open: false, title: '', content: '' },
    setModalState: mockSetModalState
  })
}))

import { jwtDecode } from 'jwt-decode'
import injections from '../../injections'

describe('useLogin', () => {
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
    const { result } = renderHook(() => useLogin(), { wrapper })

    expect(result.current).toHaveProperty('mutate')
    expect(result.current).toHaveProperty('mutateAsync')
    expect(result.current).toHaveProperty('isPending')
    expect(result.current).toHaveProperty('isSuccess')
    expect(result.current).toHaveProperty('isError')
  })

  it('should call loginUser with correct data on mutate', async () => {
    const mockToken = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }

    vi.mocked(injections.AuthUseCase.loginUser).mockResolvedValue(mockToken)
    vi.mocked(jwtDecode).mockReturnValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      username: 'johndoe'
    })

    const { result } = renderHook(() => useLogin(), { wrapper })

    result.current.mutate({ email: 'test@example.com', password: 'password123' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(injections.AuthUseCase.loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('should decode token and set user on success', async () => {
    const mockToken = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }

    vi.mocked(injections.AuthUseCase.loginUser).mockResolvedValue(mockToken)
    vi.mocked(jwtDecode).mockReturnValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      username: 'johndoe'
    })

    const { result } = renderHook(() => useLogin(), { wrapper })

    result.current.mutate({ email: 'test@example.com', password: 'password123' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(jwtDecode).toHaveBeenCalledWith('access-token')
  })

  it('should navigate to home on successful login', async () => {
    const mockToken = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }

    vi.mocked(injections.AuthUseCase.loginUser).mockResolvedValue(mockToken)
    vi.mocked(jwtDecode).mockReturnValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      username: 'johndoe'
    })

    const { result } = renderHook(() => useLogin(), { wrapper })

    result.current.mutate({ email: 'test@example.com', password: 'password123' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should set modal state with error on failure', async () => {
    const mockError = { detail: 'Invalid credentials' }
    vi.mocked(injections.AuthUseCase.loginUser).mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), { wrapper })

    result.current.mutate({ email: 'test@example.com', password: 'wrong' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockSetModalState).toHaveBeenCalledWith({
      open: true,
      title: 'Error',
      content: 'Invalid credentials'
    })
  })

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useLogin(), { wrapper })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })
})
