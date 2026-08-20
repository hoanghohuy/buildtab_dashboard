import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from '@/app/store'
import { SwrProvider } from '@/app/providers/SwrProvider'
import { AppRouter } from '@/app/router'

import { AuroraBackground } from '@/shared/components/layout/AuroraBackground'

const App = (): ReactElement => {
  return (
    <Provider store={store}>
      <SwrProvider>
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
          <AuroraBackground />
          <div className="relative z-10">
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </div>
        </div>
      </SwrProvider>
    </Provider>
  )
}

export default App
