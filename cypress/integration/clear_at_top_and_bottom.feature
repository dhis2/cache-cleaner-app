Feature: The user can clear the selected storage items at the top and the bottom of the form

    Background:
        Given some items exist

    Scenario: The user uses the top button
        Given some storage items have been selected
        And the clear button at the top is enabled
        When the user clicks the clear button at the top
        Then the selected storage items should be deleted

    Scenario: The user uses the bottom button
        Given some storage items have been selected
        And the clear button at the bottom is enabled
        When the user clicks the clear button at the bottom
        Then the selected storage items should be deleted
