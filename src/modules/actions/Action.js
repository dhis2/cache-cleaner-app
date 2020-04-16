import { Button } from '@dhis2/ui-core'
import React from 'react'
import styles from './Action.module.css'

export const Action = ({ children, ...rest }) => (
    <Button className={styles.action} {...rest}>
        {children}
    </Button>
)

Action.propTypes = {
    children: Button.propTypes.children,
}
