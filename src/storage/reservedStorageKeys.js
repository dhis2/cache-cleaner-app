export const reservedStorageKeys = [
    // exclude methods and props of Storage instances
    ...Object.keys(Storage.prototype),

    // custom dhis2 keys that should not be cleared
    'dhis2.menu.ui.headerBar.title',
    'dhis2.menu.ui.headerBar.link',
    'dhis2.menu.ui.headerBar.userStyle',
    'DHIS2_BASE_URL',
]
