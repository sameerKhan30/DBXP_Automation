describe("Apply Loan Automation", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
    });
    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Get Loan Statement");

    })

    it("Request Loan Statement", () => {

        // Clicking on Loan button on Home Page
        cy.get('[ng-reflect-router-link="manage-loan"] img').click();


    })
})