describe("Credit Card", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        // Read/Write data in json file
        cy.fixture("SupplementaryCard.json").then((setData) => {
            this.supplymentryData = setData;
        });

        cy.fixture("CreditCardDetails.json").then((getPhysiicalCard) => {
            // Take Sigle File From (ApplyLoan.json) Fixture File
            this.physicalCard = getPhysiicalCard;
        });
    });

    beforeEach("Login", () => {
        cy.login(
            this.loginData.IM.userName,
            this.loginData.IM.userPassword,
            "Login"
        );
    });

    it("Request For Supplementry Card", () => {
        // Click on the my card icon
        cy.get("ul > :nth-child(3) > a > .icon").click();

        // click on the credit card tab
        cy.get('[class="goCreditsection ng-star-inserted"]').click();
        cy.log("User clicked on the credit card tab");
        cy.wait(2000);

        // Click on the Summplementary button/option
        cy.get(
            '[ng-reflect-router-link="/my-cards/request-supplementar"] span[class="mat-button-wrapper"]'
        ).click({ force: true });

        //  Verify page header title
        cy.get('[class="h-personal-details"]')
            .eq(0)
            .should("contain", " Enter Supplementary Card Applicant Details");

        // Capture page elements
        cy.get('[class="user-details-card-style"]').then((supplementaryPage) => {
            // Enter Name
            cy.wrap(supplementaryPage)
                .find('[formcontrolname="name"]')
                .type(this.supplymentryData.name);
            cy.log("User entered name : " + this.supplymentryData.name);

            // Enter Date of Birth

            //  Click on Calender button
            cy.wrap(supplementaryPage).find("button.mat-icon-button").click();

            // Click on the year and months tab
            cy.get('[aria-label="Choose month and year"]').click();

            // Click on the previous button
            cy.get('[aria-label="Previous 24 years"]').click();

            // Choose year
            cy.get('[role="gridcell"]').each((listOfYears) => {
                const yearsList = listOfYears.text().trim();
                cy.log("Years : " + yearsList);

                if (yearsList.includes(this.supplymentryData.DateOfBirth.year)) {
                    cy.wrap(listOfYears).click();
                    cy.wait(1000);

                    // Choose Month
                    // cy.wait(2000)
                    cy.get('[role="gridcell"]').each((listOfMonths) => {
                        const monthsList = listOfMonths.text().trim();
                        cy.log("Months : " + monthsList);

                        if (monthsList.includes(this.supplymentryData.DateOfBirth.month)) {
                            cy.wrap(listOfMonths).click();
                            cy.log(
                                "Selected Month : " + this.supplymentryData.DateOfBirth.month
                            );
                            // cy.wait(2000)
                        }

                        //  Choose Date
                        cy.get('[role="gridcell"]').each((listOfDates) => {
                            const dateList = listOfDates.text().trim();
                            cy.log("Dates : " + dateList);

                            if (dateList.includes(this.supplymentryData.DateOfBirth.date)) {
                                cy.wrap(listOfDates).click();
                                cy.log(
                                    "Selected Date : " + this.supplymentryData.DateOfBirth.date
                                );
                            }
                        });
                    });
                }
            });

            // Click on the relationship dropdown
            cy.get('[formcontrolname="relationship"]').click();

            // Get the list of the reltionship
            cy.get('[role="option"]').each((relationship) => {
                const relationText = relationship.text().trim();
                cy.log("Relation List : " + relationText);
                if (relationText.includes(this.supplymentryData.motherName)) {
                    cy.wrap(relationship).click();
                    cy.get('[formcontrolname="relationship"]').should(
                        "contain",
                        this.supplymentryData.motherName
                    );
                }
            });

            // Enter National ID
            cy.get('[formcontrolname="nationalId"]').type(
                this.supplymentryData.national_ID
            );

            // Click on Proceed button
            cy.get("form.ng-dirty > .button-section > .mat-focus-indicator").click();

            // Upload Document
            cy.get('label input[type="file"]').selectFile(
                "cypress\\e2e\\UploadDocs\\sample.pdf"
            );

            //  Click on the proceed button
            cy.get('[ng-reflect-ng-class="upload-success-valid"]').click();

            // cy.wait(1000)
            cy.get(this.supplymentryData.PermanentAddress).click({ force: true });

            // Click on Proceed button
            cy.get(
                '[class="mat-focus-indicator btn proceed-button mat-stroked-button mat-button-base"]'
            ).click();

            // Enter OTP
            const OTP = "123456";
            cy.get(
                '[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]'
            ).then((enterOTP) => {
                cy.wrap(enterOTP).first().type(OTP);
                cy.log("User entered OTP : " + OTP);
                cy.wait(1000);

                // click on the verify button
                cy.get('[class="btn proceed-button otp-verify-btn"]').click();
            });
        });
    });
});
