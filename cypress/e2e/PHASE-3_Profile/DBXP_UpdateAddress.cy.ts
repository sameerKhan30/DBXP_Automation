describe("Profile & Information", () => {
    before("Read Data From Fixture File", () => { // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        cy.fixture("UpdateAddress.json").then((addressData) => { // Take data form ApplyCreditCard.json file
            this.address = addressData;
        });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
    });

    it("Redirects to Address Page", () => { // Click on My Profile dropdown
        cy.get('[id="dropdownMenuLink"]').click();

        cy.get('[class="dropdown-menu show"] [class="dropdown-item"]').each((item) => {
            const dropdDownItems = item.text().trim();
            cy.log(dropdDownItems);

            const selectDropdItems = "My Profile";
            if (dropdDownItems.includes(selectDropdItems)) {
                cy.wrap(item).click();

                // Address Page
                if (this.address.addressType.Permanent) {
                    cy.get('[alt="edit"]').first().click({ force: true });
                } else if (this.address.addressType.Temporary) {
                    cy.get('[alt="edit"]').last().click({ force: true });
                }

                cy.get('[class="block-card-form-section"]').then((addressPage) => { // Verify page title
                    cy.wrap(addressPage).find('[class="form-section-title"]').should("contain", "Address Details");

                    // Enter new address line 1
                    cy.wrap(addressPage).find('[formcontrolname="addressLine1"]').clear().type(this.address.addressLine1);
                    cy.log("Entered new address line 1 : " + this.address.addressLine1);

                    // Enter new address line 2
                    cy.wrap(addressPage).find('[formcontrolname="addressLine2"]').clear().type(this.address.addressLine2);
                    cy.log("Entered new address line 2 : " + this.address.addressLine2);

                    // Enter PIN Code
                    cy.wrap(addressPage).find('[formcontrolname="pinCode"]').clear().type(this.address.Pincode);
                    cy.log("Entered new address line 2 : " + this.address.addressLine2);

                    // Click on Document Dropdwon
                    cy.wrap(addressPage).find('[role="combobox"]').then((documentDropdown) => {
                        cy.wrap(documentDropdown).click();

                        // Get all types of document
                        cy.get('[role="option"]').each((documentType) => {
                            const documents = documentType.text().trim();
                            cy.log("Document Type: " + documents);

                            if (documents.includes(this.address.documentType)) {
                                cy.wrap(documentType).click();
                                cy.log("The selected document type is: " + documents);
                            }
                        });
                    });

                    // Upload document
                    cy.wrap(addressPage).find('[class="custom-file"]').selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                    cy.wrap(addressPage).find('[class="file-extensions ng-star-inserted"]').should("be.visible").and("contain", "Successfully Uploaded");

                    // Click on Proceed button
                    cy.wrap(addressPage).find('[type="submit"]').click();

                    // Enter OTP
                    cy.wrap(addressPage).find('[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]').then((enterOTP) => {
                        cy.wrap(enterOTP).first().type(this.address.OTP);
                        cy.log("User entered OTP : " + this.address.OTP);
                    });

                    // Verify OTP
                    cy.wrap(addressPage).find('[ng-reflect-ng-class=""] > .btn').click();
                    cy.log("User clicked on Verify button");

                    // Click on Close button
                    cy.wait(2000);
                    cy.get('[class="button close-button"]').click();
                });
            }
        });

        // Click on My Profile dropdown
        cy.get('[id="dropdownMenuLink"]').click();
        cy.wait(2000);
        cy.get(".user-container > .dropdown > .dropdown-menu > :nth-child(2) > .dropdown-item").click();

        cy.get('[class="row"] [class="col-12 logout-message"]').should("contain", "Are you sure you want to logout from MyBank ?");
        cy.get('[class="btn apply-button logout-button"]').click();
        cy.url().should("contain", "http://dbxpinnom.comviva.com/mbw/#/mbw/");
    });
});
