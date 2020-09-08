Feature: A defined set of storages keys should be ignored

    Scenario Outline: A reserved storage key to be ignored is set
        Given the <key> in the <type> storage is reserved and has a value
        Then the <key> should be in the <type> list

        Examples:
            | key                                | type    |
            | dhis2.menu.ui.headerBar.title'     | local   |
            | dhis2.menu.ui.headerBar.link'      | local   |
            | dhis2.menu.ui.headerBar.userStyle' | local   |
            | DHIS2_BASE_URL'                    | local   |
            | dhis2.menu.ui.headerBar.title'     | session |
            | dhis2.menu.ui.headerBar.link'      | session |
            | dhis2.menu.ui.headerBar.userStyle' | session |
            | DHIS2_BASE_URL'                    | session |
