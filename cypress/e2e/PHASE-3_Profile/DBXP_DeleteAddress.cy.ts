describe("Credit Card", () => {
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
                cy.wait(3000)
                if (this.address.addressType.Temporary) {
                    cy.get('[alt="delete"]').first().click({ force: true });
                } else if (this.address.addressType.Temporary) {
                    cy.get('[alt="edit"]').last().click({ force: true });
                }

                cy.get('mat-dialog-content.mat-dialog-content > .row > .col-sm-12').then(($deleteAddress) => {
                    const address = $deleteAddress.find('[class="congratulations-tag mat-dialog-content ng-star-inserted"]').text().trim()
                    cy.log(address)

                    const getData = {
                        address
                    }

                    // Write address into json file
                    cy.writeFile('cypress\\fixtures\\addressData.json', getData)
                    cy.get('[class="button yes-button"]').click()

                    // Enter OTP
                    cy.wait(1000)
                    cy.get('[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]').then((enterOTP) => {
                        cy.wrap(enterOTP).first().type(this.address.OTP);
                        cy.log("User entered OTP : " + this.address.OTP);
                    });

                    // Verify OTP
                    cy.get('[class="btn send-otp-verify-right"]').click();
                    cy.log("User clicked on Verify button");

                    // Click on Close button
                    cy.wait(1000);
                    cy.get('[class="button close-button"]').click();
                })
            }
        })
    })
})
