import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ConfigProvider, theme } from 'antd'
import 'antd/dist/reset.css'

// INC-inspired theming
const INC = {
  saffron: '#FF671F',
  green: '#138808'
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: INC.green,
          colorInfo: INC.green,
          colorWarning: INC.saffron,
          borderRadius: 12
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
)