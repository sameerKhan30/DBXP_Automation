describe("Profle & Information", () => {
    before("Read Data From Fixture File", () => { // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        cy.fixture("Nickname.json").then((setNickName) => { // Take Sigle File From (LoginData) Fixture File
            this.nickNameData = setNickName;
        });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
        cy.wait(3000)
    })

    it("Add/UpdateDelete Nickname", () => {

        // Click on Dropdown
        cy.get('[id="dropdownMenuLink"]').click();

        // Click on My Profile button
        cy.get('.user-container > .dropdown > .dropdown-menu > :nth-child(1) > .dropdown-item').first().click();
        cy.wait(500)

        // click on the nickname for DBXP bank
        cy.get('.mat-card-section > .card-item').first().click({ force: true });
        cy.wait(500)


        cy.get('[class="mat-card mat-focus-indicator mat-card-section"]').then((nickNamePage) => {
            cy.wait(1000)

            // Verify header title
            cy.wrap(nickNamePage).should('contain', 'Nickname Details')

            // Iterate account types
            cy.wrap(nickNamePage).find('[class="card-item ng-star-inserted"]').each((accountType) => {
                const account = accountType.text().trim()
                cy.log("Nickname Account Types: " + account)

                const accountSelection = this.nickNameData.accountType.Credit

                // For Nickname Details for DBXP-Credit Cards
                if (account.includes(accountSelection)) {
                    cy.wrap(accountType).click()

                    // Iterate account numbers
                    cy.get('[class="card-item ng-star-inserted"]').each((accountNumber) => {
                        const accNumber = accountNumber.text().trim()
                        cy.log("Account Number: " + accNumber)

                        if (accNumber.includes("4439XXXXXXXX4028")) {


                            // 
                        }


                        // Adding Nickname
                        // if (accNumber.includes("Add Nickname")) {
                        //     cy.get('.card-item-img_rtl').click()

                        //     // Fill data
                        //     cy.get('[placeholder="Nickname"]').type(this.nickNameData.userName)
                        // }
                    })
                }

            })
        })
    })




})



