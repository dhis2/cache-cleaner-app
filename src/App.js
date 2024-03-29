import { CssVariables } from '@dhis2/ui'
import React from 'react'
import './locales/index.js'
import { Home } from './views/index.js'

export default function App() {
    return (
        <div className="container">
            <CssVariables colors spacers />
            <Home />
        </div>
    )
}
