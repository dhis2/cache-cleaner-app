Feature: All items can be toggled on and off

    Background:
        Given every section has items

    Scenario: The user selects all items not-selected items
        When the user clicks the select-all button for all sections
        Then all checkbox in all sections should be selected

    Scenario: The user selects all items despite all items being selected already
        Given all items are selected
        When the user clicks the select-all button for all sections
        Then no selected state should change

    Scenario: The user deselects all items non-selected items of a section
        Given all items are selected
        When the user clicks the deselect-all button for all sections
        Then all checkbox in all sections should not be selected

    Scenario: The user deselects all items despite all items being selected already
        Given no item is selected
        When the user clicks the deselect-all button for all sections
        Then no selected state should change
