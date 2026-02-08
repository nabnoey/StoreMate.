import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router'
import {store} from './redux/store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
// import { UserContextProvider } from './context/UserContextProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
<RouterProvider router={router} />
</Provider>

  
  </StrictMode>,
)

