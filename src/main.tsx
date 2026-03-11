// main.tsx
import { StrictMode, useEffect } from 'react' 
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router'
import { store } from './redux/store'
import { Provider, useDispatch } from 'react-redux' 
import { RouterProvider } from 'react-router-dom'
import Loading from './components/user/Loading'
import { stopLoading } from './redux/loading/loadingReducer'

// 1. เพิ่ม Import Toaster
import { Toaster } from 'react-hot-toast' 

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(stopLoading());
    }, 1500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <Loading />
        
        {/* 2. เพิ่ม Toaster วางไว้ตรงนี้ครับ */}
        <Toaster position="top-center" reverseOrder={false} /> 
        
        <RouterProvider router={router} />
      </AppInitializer>
    </Provider>
  </StrictMode>
)