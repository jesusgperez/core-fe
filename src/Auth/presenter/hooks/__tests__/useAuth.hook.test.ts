import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuth } from '../useAuth.hook'

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn()
}))

vi.mock('../../../../common/presenter/hooks', () => ({
  useLocalStorage: vi.fn()
}))

vi.mock('../../injections', () => ({
  default: {
    AuthUseCase: {
      refreshToken: vi.fn()
    }
  }
}))

import { jwtDecode } from 'jwt-decode'
import { useLocalStorage } from '../../../../common/presenter/hooks'
import injections from '../../injections'

describe('useAuth', () => {
  const mockNavigate = vi.fn()
  const mockSetUser = vi.fn()
  const mockGetStorage = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLocalStorage).mockReturnValue({
      getStorage: mockGetStorage,
      setStorage: vi.fn()
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should navigate to login when no token exists', async () => {
    mockGetStorage.mockReturnValue(null)

    await useAuth({ navigate: mockNavigate, setUser: mockSetUser })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('should navigate to login when token has no accessToken', async () => {
    mockGetStorage.mockReturnValue({ refreshToken: 'refresh' })

    await useAuth({ navigate: mockNavigate, setUser: mockSetUser })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('should navigate to login when token has no refreshToken', async () => {
    mockGetStorage.mockReturnValue({ accessToken: 'access' })

    await useAuth({ navigate: mockNavigate, setUser: mockSetUser })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('should navigate to login when refresh token is expired', async () => {
    mockGetStorage.mockReturnValue({
      accessToken: 'access',
      refreshToken: 'refresh'
    })

    // Expired refresh token (exp in the past)
    vi.mocked(jwtDecode).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
    })

    await useAuth({ navigate: mockNavigate, setUser: mockSetUser })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('should set user when access token is valid', async () => {
    mockGetStorage.mockReturnValue({
      accessToken: 'access',
      refreshToken: 'refresh'
    })

    const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now

    // First call for refresh token check
    vi.mocked(jwtDecode)
      .mockReturnValueOnce({ exp: futureExp }) // refresh token valid
      .mockReturnValueOnce({ // access token valid with user data
        exp: futureExp,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        username: 'johndoe'
      })

    await useAuth({ navigate: mockNavigate, setUser: mockSetUser })

    expect(mockSetUser).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      username: 'johndoe'
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should refresh token and set user when access token is expired but refresh token is valid', async () => {
    mockGetStorage.mockReturnValue({
      accessToken: 'old-access',
      refreshToken: 'refresh'
    })

    const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    const pastExp = Math.floor(Date.now() / 1000) - 100 // expired

    vi.mocked(jwtDecode)
      .mockReturnValueOnce({ exp: futureExp }) // refresh token valid
      .mockReturnValueOnce({ exp: pastExp }) // access token expired
      .mockReturnValueOnce({ // new decoded access token from refresh
        exp: futureExp,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        username: 'janesmith'
      })

    vi.mocked(injections.AuthUseCase.refreshToken).mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh'
    })

    await useAuth({ navigate: mockNavigate, setUser: mockSetUser })

    expect(injections.AuthUseCase.refreshToken).toHaveBeenCalledWith('refresh')
    expect(mockSetUser).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      username: 'janesmith'
    })
  })

  it('should navigate to login when refresh token call fails', async () => {
    mockGetStorage.mockReturnValue({
      accessToken: 'old-access',
      refreshToken: 'refresh'
    })

    const futureExp = Math.floor(Date.now() / 1000) + 3600
    const pastExp = Math.floor(Date.now() / 1000) - 100

    vi.mocked(jwtDecode)
      .mockReturnValueOnce({ exp: futureExp }) // refresh token valid
      .mockReturnValueOnce({ exp: pastExp }) // access token expired

    vi.mocked(injections.AuthUseCase.refreshToken).mockRejectedValue(new Error('Refresh failed'))

    await useAuth({ navigate: mockNavigate, setUser: mockSetUser })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
    expect(mockSetUser).not.toHaveBeenCalled()
  })
})
