describe("Credit Card", () => {
    before("Read Data From Fixture File", () => {

        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {

            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });

        // Read/Write data in json file
        cy.fixture('SupplementaryCard.json').then((setData) => {
            this.supplymentryData = setData
        })
    })

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
    })

    it('Request For Supplementry Card', () => {
        // Click on the my card icon
        cy.get('ul > :nth-child(3) > a > .icon').click();

        // click on the credit card tab
        cy.get('[class="goCreditsection ng-star-inserted"]').click()
        cy.log("User clicked on the credit card tab");
        cy.wait(500)
    })
})