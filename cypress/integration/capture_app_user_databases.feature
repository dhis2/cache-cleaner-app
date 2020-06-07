Feature: User specific databases of the capture app are listed

    Scenario: Some user databases are listed
        Given some user databases exist
        When the user deletes the dhis2ca database
        Then the user databases should be deleted as well
