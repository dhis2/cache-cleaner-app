Feature: Clean Capture app databases

    Scenario: The user cleans Capture app databases
        Given some Capture app databases exist
        When the user clears dhis2ca
        Then all the Capture app databases should be deleted
