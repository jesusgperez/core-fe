import './App.css'
import { GlobalProvider } from './common/presenter/contexts/global'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthRoutes } from './Auth/presenter/pages'
import { CommonRoutes } from './common/presenter/pages'


const queryClient = new QueryClient()

function App() {
  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthRoutes />
          <CommonRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalProvider>
  )
}

export default App
