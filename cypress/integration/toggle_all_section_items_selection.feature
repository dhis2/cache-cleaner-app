Feature: All items in a storage section can be toggled on and off

    Scenario Outline: The user selects all items non-selected items of a section
        Given the <section> has items
        And no item is selected
        When the user clicks the select-all button of that section
        Then all checkbox in the section should be selected

        Examples:
            | section   |
            | local     |
            | session   |
            | indexedDb |

    Scenario Outline: The user selects all items despite all items being selected already
        Given the <section> has items
        And all item are selected
        When the user clicks the select-all button of that section
        Then no selected state should change

        Examples:
            | section   |
            | local     |
            | session   |
            | indexedDb |

    Scenario Outline: The user deselects all  items of a section
        Given the <section> has items
        And all item are selected
        When the user clicks the deselect-all button of that section
        Then no checkbox in the section should be selected

        Examples:
            | section   |
            | local     |
            | session   |
            | indexedDb |

    Scenario Outline: The user deselects all items despite all items being selected already
        Given the <section> has items
        And no item is selected
        When the user clicks the deselect-all button of that section
        Then no selected state should change

        Examples:
            | section   |
            | local     |
            | session   |
            | indexedDb |
