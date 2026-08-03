'use client'

import { ConfigProvider } from 'antd'

function ClientProviders({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FF8A00',
          colorPrimaryHover: '#CC6E00',
          colorPrimaryActive: '#B35E00',
          colorText: '#111111',
          colorTextSecondary: '#222222',
          colorBgContainer: '#FFFFFF',
          colorBorder: 'rgba(255, 138, 0, 0.15)',
          borderRadius: 8,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontFamilyCode: "'JetBrains Mono', monospace",
          fontSize: 15,
          fontSizeHeading1: 32,
          fontSizeHeading2: 24,
          fontSizeHeading3: 20,
          fontSizeHeading4: 17,
          fontSizeHeading5: 15,
          lineHeight: 1.7,
          controlHeight: 40,
          controlHeightLG: 48,
          controlHeightSM: 32,
        },
        components: {
          Steps: {
            colorTextDescription: '#222222',
            colorPrimary: '#FF8A00',
            colorFinish: '#FF8A00',
            colorWait: '#222222',
            colorProcess: '#FF8A00',
            fontSize: 13,
          },
          Select: {
            colorPrimary: '#FF8A00',
            colorPrimaryHover: '#CC6E00',
          },
          DatePicker: {
            colorPrimary: '#FF8A00',
            colorPrimaryHover: '#CC6E00',
          },
          Input: {
            colorPrimary: '#FF8A00',
            colorPrimaryHover: '#CC6E00',
          },
          Upload: {
            colorPrimary: '#FF8A00',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default ClientProviders