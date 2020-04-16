import React from 'react'
import propTypes from '@dhis2/prop-types'
import styles from './Actions.module.css'

export const Actions = ({ children }) => (
    <div className={styles.actions}>{children}</div>
)

Actions.propTypes = {
    children: propTypes.node,
}
