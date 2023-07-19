describe("Pre Approved Loan", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
        cy.fixture("PreApprovedLoan.json").then((getPreApprovedLoanData) => {
            // Take Sigle File From (ApplyLoan.json) Fixture File
            this.preApproved = getPreApprovedLoanData;
        });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
        cy.wait(3000)
    });

    it("TC_01 -> Click on Pre Approved Loan Card", () => {
        //  ---- Getting pre approved loan card  --------------
        cy.get("#pr_id_2").scrollIntoView();
        var number = 2 // Home Loan
        cy.get('p-button[type="button"]').eq(number).click()

        cy.get("div").find("#cdk-step-content-0-0").then(($preApprovedPage) => {
            const pageTitle = $preApprovedPage.find('[class="offers-heading ng-star-inserted"]').text().trim()
            cy.log("Page Title: " + pageTitle)


            cy.wait(5000)
            // --------- Getting data how much amount user is eligible for laon
            const userEligibility = $preApprovedPage.find('[class="title-btn-text"] [class="card-title mb-0"]').text().trim()
            cy.log("User Elegibility" + userEligibility)

            // --------- Getting minimum amount
            const minimumAmount = $preApprovedPage.find('[class="btn btn-loan mat-stroked-button offer-label mb-0"]').text().trim()
            cy.log("Minimum Amount: " + minimumAmount)

            // --------- Getting maximum amount
            const maximumAmount = $preApprovedPage.find('[class="btn btn-loan btn-check-eligiblity mat-stroked-button offer-label mb-0"]').text().trim()
            cy.log("Maximum Amount: " + maximumAmount)

            // Getting currency type
            const currecyType = $preApprovedPage.find('[formcontrolname="currencyId"]').text().trim()
            cy.log("Currecy Type: " + currecyType)

            // Validating amount in amount text box and enter the amount
            const preFilledAmount = $preApprovedPage.find('[formcontrolname="loanAmount"]')
            const myValue = this.preApproved.Amount

            // User's entered amount
            // cy.wrap(myValue).should("be.gte", 100000).and("be.lte", 1100000)
            // cy.wrap(preFilledAmount).clear({ force: true })
            //     .type(myValue.toString())
            // cy.log("Entered Amount: " + myValue)

            //  Validating minimum tenure
            const minimumTenure = $preApprovedPage.find('[class="min-tenure-label"]').text().trim()
            cy.log("Minimum tenure : " + minimumTenure)

            //  Validating maximum tenure
            const maximumTenure = $preApprovedPage.find('[class="tenure-label"]').text().trim()
            cy.log("Minimum tenure : " + maximumTenure)



        })


    })


    //     // cy.get('[class="col description-column"] [type="button"]').each((button) => {
    //     //     if (banner.includes("Home")) {
    //     //         button.first().click();
    //     //     }
    //     // });
    // });
});

