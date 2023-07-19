describe("Profle & Information", () => {
    before("Read Data From Fixture File", () => { // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        cy.fixture("UpdateKYC.json").then((KYC) => { // Take data form ApplyCreditCard.json file
            this.kycDocument = KYC;
        });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
    });

    it("Redirects to KYC Page", () => { // Click on My Profile dropdown
        cy.get('[id="dropdownMenuLink"]').click();

        cy.get('[class="dropdown-menu show"] [class="dropdown-item"]').each((item) => {
            const dropdDownItems = item.text().trim();
            cy.log(dropdDownItems);

            const selectDropdItems = "My Profile";
            if (dropdDownItems.includes(selectDropdItems)) {
                cy.wrap(item).click()
                cy.scrollTo(0, 800)
                cy.wait(3000)

                cy.get('[class="col-sm-6"] [class="layout-background kyc-main-div"]').each((kycItems) => {
                    const kycDocuments = kycItems.text().trim();
                    cy.log("Docuements: " + kycDocuments)

                    if (kycDocuments.includes(this.kycDocument.Document)) {
                        cy.wrap(kycItems).click()
                    }
                })

                cy.get('[class="block-card-form-section"]').then((documentPage) => {
                    const headerTitle = documentPage.find('[class="form-section-title"]').text().trim()
                    cy.wrap(documentPage).should('contain', headerTitle)
                    cy.log("Header Title: " + headerTitle)

                    // cy.wait(3000)
                    // Verify that the document name field is visible
                    cy.wrap(documentPage).find('[formcontrolname="documentName"]').should('be.visible')

                    // Verify that the document number field is visible
                    cy.wrap(documentPage).find('[formcontrolname="docNumber"]').should('be.visible')

                    // View document
                    cy.wrap(documentPage).find('[class="document-name"]').click()
                    cy.wait(2000)

                    // Click on the cross button
                    cy.wrap(documentPage).find('[class="cross-btn"]').click()

                    // Click on Update KYC button
                    cy.wrap(documentPage).find('[class="btn apply-button"]').click()

                    // Enter PAN Card Holder Name
                    cy.wrap(documentPage).find('[formcontrolname="holderName"]').type("Sameer Khan")
                    cy.log("Holde Name : " + this.kycDocument.holderName)

                    // Enter Docuemnt Number
                    cy.wrap(documentPage).find('[formcontrolname="documentNumber"]').type(this.kycDocument.docuemntNumber)
                    cy.log("Enter Document Number : " + this.kycDocument.docuemntNumber)

                    // Upload document
                    cy.wrap(documentPage).find('[class="custom-file"]').selectFile("cypress\\e2e\\UploadDocs\\sample.pdf")
                    cy.wrap(documentPage).find('[class="file-extensions ng-star-inserted"]')

                    // Click on Proceed button
                    cy.wrap(documentPage).find('[class="btn apply-button"]').click()

                    // Enter OTP
                    cy.wait(1000)
                    cy.get('[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]').then((enterOTP) => {
                        cy.wrap(enterOTP).first().type(this.kycDocument.OTP);
                        cy.log("User entered OTP : " + this.kycDocument.OTP);
                    });

                    // Verify OTP
                    cy.get('[class="btn apply-button apply-button-right"]').click();
                    cy.log("User clicked on Verify button");

                    // Click on Close button
                    cy.wait(1000)
                    cy.get('[class="button close-button"]').click()
                })
            }
        });

    })
})
