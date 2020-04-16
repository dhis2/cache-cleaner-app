import { CssVariables } from '@dhis2/ui-core'
import React from 'react'

import { Home } from './views/Home'

export default function App() {
    return (
        <div className="container">
            <CssVariables colors spacers />
            <Home />
        </div>
    )
}
