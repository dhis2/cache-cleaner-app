import { CssVariables } from '@dhis2/ui-core'
import React from 'react'

import { Home } from './views/Home'

const MyApp = () => (
    <div className="container">
        <CssVariables spacers />
        <Home />
    </div>
)

export default MyApp
