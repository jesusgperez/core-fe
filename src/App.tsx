import './App.css'
import { GlobalProvider } from './common/presenter/contexts/global'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthRoutes } from './Auth/presenter/pages'
import { CommonRoutes } from './common/presenter/pages'


const queryClient = new QueryClient()

const AppRoutes = () => useRoutes([
  ...AuthRoutes,
  ...CommonRoutes,
])

function App() {
  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalProvider>
  )
}

export default App
