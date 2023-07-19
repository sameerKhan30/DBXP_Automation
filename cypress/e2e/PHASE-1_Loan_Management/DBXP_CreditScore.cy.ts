// import { expect } from "chai";

describe("Apply Loan Automation", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
    });
    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
        // cy.login(this.loginData.Standalone.userName, this.loginData.Standalone.userPassword, "Check Credit Score and Download Report");

    });

    it.only("Test the functionality of the download credit report functionalty", () => {
        cy.scrollTo("bottom")
        cy.get('[class="row payments-card"] [class="col-sm-12 send-title"]').eq(1).click()
        // cy.get('app-credit-score > .row').click()   // Standalone
        cy.wait(1000)

        // Getting credit score page elements
        cy.get('[class="credit-score-container"]').then(($creditScoreContainer) => {

            //   Getting the text of the page title
            const creditScorePageTitle = $creditScoreContainer.find('[class="col-8 credit-score-title"]').text().trim();
            cy.log("Page Title : " + creditScorePageTitle);

            //   Getting the text of the user's name
            const userName = $creditScoreContainer.find('[class="col-8 username-title"] span').text().trim();
            cy.log("User name : " + userName);

            //  Getting the text of the message
            const message = $creditScoreContainer.find('[class="col-8 username-title"] p').text().trim();
            cy.log("Message : " + message);

            // Getting the text of the credit score
            const creditScoreNumber = $creditScoreContainer.find('[class="score-value"]').text().trim();
            cy.log("Credit Score Number : " + creditScoreNumber);

            // Getting the text of credit score rating
            const creditScoreRating = $creditScoreContainer.find('[class="score-rating-value"]').text().trim();
            cy.log("Credit Score Rating : " + creditScoreRating);

            //  Creating an object for writting data in json

            const CreditScore = {
                creditScorePageTitle,
                userName,
                message,
                creditScoreNumber,
                creditScoreRating
            }
            // Writting the data in json file and in the given path of the file
            cy.writeFile('cypress//fixtures//CreditScore.json', CreditScore)

            // Reading the data from the fixture file for validation
            cy.fixture("CreditScore.json").then((creditScore) => {
                // expect(creditScorePageTitle).contains(CreditScore.creditScorePageTitle)
                expect(creditScore.creditScorePageTitle).to.equal(creditScorePageTitle)
                expect(creditScore.userName).to.equal(userName)
                expect(creditScore.message).to.equal(message)
                expect(creditScore.creditScoreNumber).to.equal(creditScoreNumber)
                expect(creditScore.creditScoreRating).to.equal(creditScoreRating)
            })
        })

        // Clicking on the "Download Report" button
        // cy.get('[routerlink="/credit-score/download-report"]').should("be.visible")
        cy.get('[routerlink="/credit-score/download-report"]').click()


        // Clicking on the checkbox of send me a copy on the mail
        // cy.get('[id="emailcheck"] [class="mat-checkbox-inner-container"]').should("not.be.checked")
        // cy.get('[id="emailcheck"] [class="mat-checkbox-inner-container"]').click()
        // cy.wait(3000)

        // click on the download button
        cy.get('[type="submit"] [class="mat-button-wrapper"]').click();
        cy.get('[class="mat-button-wrapper"]').then((downloadButton) => {
            const downloadButtonText = downloadButton.text().trim();
            if (downloadButtonText.includes("Download")) {  // Download & Send
                cy.get('[class="congratulations-tag mat-dialog-content"]')
                    .should("be.visible").and("contain", "Your report has been downloaded and sent to the email successfully");
                cy.log("Your report has been downloaded and sent to the email successfully");
            }
            else if (downloadButtonText.includes("Download")) {
                cy.get('[class="congratulations-tag mat-dialog-content"]')
                    .should("be.visible").and("contain", "Your report has been downloaded successfully");
                cy.log("Your report has been downloaded successfully");
            }


            cy.wait(1000)
            //  Validating success page
            cy.get('[class="congratulations mat-dialog-title"]')
                .should("be.visible")
                .and("contain", "Successful");
            cy.get('[class="success-image"]').should("be.visible");
            cy.get('[class="button close-button"]').click()
            // cy.get('.button').click()
        }
        )
    }
    )

    it("Read file", () => {

    })
})
