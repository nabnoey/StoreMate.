import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from 'react-router-dom'
import router from './router/index.tsx'
import { UserContextProvider } from './context/UserContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserContextProvider>
    <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>,
)

