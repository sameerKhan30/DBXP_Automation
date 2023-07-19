describe('Apply Loan Automation', () => {
    before('Read Data From Fixture File', () => { // Read Data From Fixture File
        cy.fixture('Login.json').then(setLoginData => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData
        })
        cy.fixture('CreditCardDetails.json').then(setDisputeData => { // Take Sigle File From (ApplyLoan.json) Fixture File
            this.disputeTransactionData = setDisputeData
        })
    })

    beforeEach('Login', () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, 'Login')
    })

    it('Despute Transaction', () => {
        // Click on the my card icon
        cy.get('ul > :nth-child(3) > a > .icon').click();

        // click on the credit card tab
        cy.get('[class="goCreditsection ng-star-inserted"]').click()
        cy.log("User clicked on the credit card tab");
        cy.wait(2000)

        // Verify title
        cy.scrollTo('bottom')
        cy.get('[class="section-title cardstatement0"]').should('contain', ' Transaction History ')

        cy.get('[class="mat-table cdk-table mat-sort"]').then((disputeTransaction) => {
            // cy.wrap(disputeTransaction).find('[class="mat-row cdk-row ng-star-inserted"]').each((disputeList) => {
            //     const dispute = disputeList.text().trim()
            //     cy.log("Dispute : " + dispute)

            //     if (dispute.includes("sportwear")) {
            //         cy.wrap(disputeTransaction).click()
            //     }
            // })

            // cy.get('[class="mat-row cdk-row ng-star-inserted"]').each((disputeList) => {
            //     const dispute = disputeList.text().trim()
            //     cy.log("Dispute : " + dispute)

            //     if (dispute.includes("sportwear")) {
            //         cy.wrap(disputeList).click({ force: true })
            //     }
            // })

            cy.get(
                '[class="mat-cell cdk-cell td-description cdk-column-description mat-column-description ng-star-inserted"]'
            ).each((transaction) => {
                const desciption = transaction.text().trim();
                if (
                    desciption.includes('sportwear'
                        // this.creditCardData.Dispute_Transaction.Description.Sportwear
                    )
                ) {
                    cy.wrap(transaction).click();
                }
            })

            cy.get('[class="mat-card-content"]').then(($detailsCard) => {

                // Get reference id
                const refrenceId = $detailsCard.find('div [class="reference-number"]').first().text().trim();
                cy.log("RefrenceId: " + refrenceId)

                // Get sender name
                const senderName = $detailsCard.find('[class="names"]').eq(0).text().trim();
                cy.log("Sender Name: " + senderName)

                // Get receiver name
                const receiverName = $detailsCard.find('[class="names"]').eq(1).text().trim();
                cy.log("Receiver Nane: " + receiverName)


                // // Get reference id
                // const refrenceId = $detailsCard.find('[class="reference-number"]').text().trim();
                // cy.log("RefrenceId: " + refrenceId)


                const disputeTransactionDetails = {
                    refrenceId,
                    senderName,
                    receiverName
                }

                cy.writeFile('cypress\\fixtures\\PHASE - 2 Credit Card\\DisputeTransaction.json', [disputeTransactionDetails])
            })
        })
    })
})