Feature: List all clearable local storage items

    Scenario Outline: There are some clearable items in the storage
        Given some items are stored in the <type> storage
        Then all items should be listed as clearable

        Examples:
            | type      |
            | local     |
            | session   |
            | indexedDb |

    Scenario Outline: There are no items in the storage
        Given no items are stored in the <type> storage
        Then the section should not show any checkboxes
        And a text explaining that no items exist should be displayed

        Examples:
            | type      |
            | local     |
            | session   |
            | indexedDb |
