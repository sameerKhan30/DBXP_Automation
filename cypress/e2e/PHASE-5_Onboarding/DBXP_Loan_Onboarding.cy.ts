
describe("Loan Onboarding", () => {
    before("Read Data From Fixture File", () => {
        // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => {
            // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
        cy.fixture("Loan_Onboarding.json").then((setData) => {
            this.setOnboardData = setData;
        });
    });

    beforeEach("Login", () => {
        // cy.visit("http://dbxpinnom.comviva.com/mbw/#/mbw/login") IM
        cy.visit("http://dbxp.int.comviva.com/mbw/#/mbw/login");
        cy.wait(500);
    });

    it("Loan Onboarding", () => {
        // Click on  Don't have an account ? button
        cy.get('[class="col-12 activation-card"]').click();

        // Click on Loan Onboarding options
        cy.contains(" Loans ").should("be.visible").click();

        // Click on proceed button
        cy.get('[class="btn submit-button"]').click();

        // Validate Steps
        cy.wait(500);
        cy.contains(" Select Loan ").should("be.visible");
        cy.contains(" Verify & Add Details ").should("be.visible");
        cy.contains(" Select the Documents ").should("be.visible");
        cy.contains(" Create Password ").should("be.visible");
        cy.contains(" Upload Picture ").should("be.visible");

        // Click on Start button
        cy.get('[class="btn submit-button start-btn"]').click();
        cy.wait(3000);

        cy.get('[class="account-creation-section"]').then((page) => {
            cy.wrap(page).find('[class="loan-select-box"]').click();
            cy.get('[role="option"]').each((loanTypes) => {
                const types = loanTypes.text().trim();
                cy.log("Loan Type: " + types);

                if (types.includes("Personal")) {
                    cy.wrap(loanTypes).click();
                    cy.wait(500);
                    cy.scrollTo('top')

                    // Click on currency dropdown
                    cy.wrap(page).find('[formcontrolname="currency"]').click();
                    cy.get('[role="option"]').each((currency) => {
                        const currencyTypes = currency.text().trim();
                        cy.log("Currency Type: " + currencyTypes);

                        if (currencyTypes.includes("THB")) {
                            cy.wrap(currency).click();

                            // Enter amount
                            cy.wrap(page)
                                .find('[formcontrolname="amount"]')
                                .clear({ force: true })
                                .type("10000");

                            // Enter tenure
                            cy.get('[formcontrolname="tenure"]').last().clear().type("2");

                            // Click on Proceed button
                            cy.wrap(page).find('[class="btn send-otp"]').click();
                        }
                    });
                }
            });

            // Generate a random mobile number
            const getRandomNumber = () => {
                const randomNumber = Math.floor(Math.random() * 100000);
                const formattedNumber = randomNumber.toString().padStart(5, "0");
                return formattedNumber;
            };

            const generateRandomNumber = () => {
                const prefix = "777144";
                const randomNumber = getRandomNumber();
                return prefix + randomNumber;
            };

            // Enter mobile number
            const mobileNumber = generateRandomNumber();
            cy.log(mobileNumber);

            cy.get('[placeholder="Enter mobile number"]').type(mobileNumber);

            // Click on Proceed button
            cy.get(
                '#cdk-step-content-0-0 > [style=""] > .form-section > .form-style > .form-group > .btn'
            ).click();

            // Enter OTP number
            cy.wait(500);
            cy.get(
                '[class="ng-otp-input-wrapper wrapper ng-star-inserted"] [autocomplete="one-time-code"]'
            ).then((enterOTP) => {
                cy.wrap(enterOTP).first().type(this.setOnboardData.OTP);
                cy.log("User entered OTP : " + this.setOnboardData.OTP);

                cy.wait(500);
                // Click on Verify OTP button
                cy.wrap(page)
                    .find(".form-section.form-group > .form-group > .btn")
                    .click();
                cy.wrap(page).find('[class="mobile-green-tick"]').should("be.visible");
                cy.wrap(page)
                    .find('[class="mobile-verified-success mt-1"]')
                    .should("contain", "Mobile no. verified successfully");

                // Click on Proceed button
                cy.wrap(page)
                    .find(
                        '#cdk-step-content-0-2 > [style=""] > .form-section > form.ng-dirty > .form-group > .btn'
                    )
                    .click();

                // Generate random email address
                function generateRandomEmail() {
                    const baseEmail = 'Test';
                    const randomNumber = Math.floor(Math.random() * 200);
                    const domain = 'gmail.com';

                    const email = `${baseEmail}${randomNumber}@${domain}`;
                    return email;
                }

                // Usage
                const emailaddress = generateRandomEmail();
                cy.log(emailaddress);


                // Enter email address
                cy.wrap(page)
                    .find('[formcontrolname="email"]')
                    .type(emailaddress);

                // Click on Proceed button
                cy.wrap(page)
                    .find(
                        '#cdk-step-content-0-3 > [style=""] > .form-section > .form-style > .form-group > .btn'
                    )
                    .click();
            });
            cy.wrap(page)
                .find('[class="form-title-section ng-star-inserted"]')
                .should("contain", " Great! Let’s get to know you a little better ")
                .and(
                    "contain",
                    "We’ll just keep this information to ourselves. Trust us!"
                );
            // Enter first name
            cy.wrap(page)
                .find('[formcontrolname="firstName"]')
                .type(this.setOnboardData.firstName);

            // Enter last name
            cy.wrap(page)
                .find('[formcontrolname="lastName"]')
                .type(this.setOnboardData.lastName);

            // Enter father name
            cy.wrap(page)
                .find('[formcontrolname="fatherName"]')
                .type(this.setOnboardData.fatherName);

            // Getting all calender years

            // Click on the calender button
            cy.get('[aria-label="Open calendar"]').click();
            cy.wait(500);
            cy.get(".mat-calendar-period-button").click();
            cy.get('[class="mat-calendar-body"]').then((calenderYearData) => {
                cy.wrap(calenderYearData)
                    .find('[role="gridcell"] div')
                    .each((calenderYears) => {
                        const years = calenderYears.text().trim();
                        cy.log("Years : " + years);

                        if (years.includes(this.setOnboardData.selectYear)) {
                            // Select year
                            cy.wrap(calenderYears).click({ force: true });

                            cy.wait(500);
                            cy.get('[mat-calendar-body][class="mat-calendar-body"]').then(
                                (calnderMonthsData) => {
                                    cy.wrap(calnderMonthsData)
                                        .find('td[role="gridcell"]')
                                        .each((calnderMonth) => {
                                            const months = calnderMonth.text().trim();
                                            // cy.log("Months : " + months);

                                            // Select month
                                            if (months.includes(this.setOnboardData.selectMonth)) {
                                                cy.wrap(calnderMonth).click({ force: true });

                                                cy.get('[class="mat-calendar-body"]').then(
                                                    (calenderDateData) => {
                                                        cy.wrap(calenderDateData)
                                                            .find('[role="gridcell"]')
                                                            .each((calenderDates) => {
                                                                const date = calenderDates.text().trim();
                                                                // cy.log("Date : " + date);
                                                                if (date.includes(this.setOnboardData.selectDate)) {
                                                                    cy.wrap(calenderDates).click({ force: true });
                                                                }
                                                            });
                                                    }
                                                );
                                            }
                                        });
                                }
                            );
                        }
                    });
            });
            // Enter PAN number
            cy.wrap(page)
                .find('[formcontrolname="panCardNo"]')
                .type(this.setOnboardData.panNumber);

            // Select Gender
            cy.wrap(page)
                .find('[class="mat-radio-label"]')
                .each((genders) => {
                    const gender = genders.text().trim();
                    cy.log("Gender: " + gender);

                    if (gender.includes(this.setOnboardData.gender)) {
                        cy.wrap(genders).click();
                    }
                });

            // Click on Prceed button
            cy.wrap(page).find('[class="btn send-otp"]').eq(0).click();

            cy.wrap(page)
                .find('[class="form-title-section"]')
                .first()
                .should("contain", " Where do you live  ? ")
                .and("contain", "This information is important for official purposes");

            // Enter Address Line 1
            cy.wrap(page)
                .find('[formcontrolname="addressLine1"]')
                .type(this.setOnboardData.addressLine1);

            // Enter PIN Code
            cy.wrap(page)
                .find('[formcontrolname="pinCode"]')
                .type(this.setOnboardData.pinCode);

            // Enter PIN Code
            cy.wrap(page).find(":nth-child(4) > .btn").click();
            cy.wait(400);

            cy.wrap(page)
                .find('[class="form-title-section"]')
                .eq(1)
                .should("contain", " Tell us where do you work ? ")
                .and("contain", "This information is important for official purposes");

            // Choose Employement Type
            // Click on Employement Type dropdown
            cy.wrap(page).find('[role="combobox"]').click();
            cy.wrap(page)
                .get('[role="option"]')
                .each((employementDropDownValues) => {
                    // Dropdown text is stored in the "employementTypeText" variable
                    const employementTypeText = employementDropDownValues.text().trim();
                    cy.log("Employment type is : " + employementTypeText);

                    // Provide Loan Type
                    const chooseEmployementType =
                        this.setOnboardData.employementTypes.Salaried;
                    if (employementTypeText.includes(chooseEmployementType)) {
                        cy.wrap(employementDropDownValues).click();

                        // Enter Date for Employement Type RETIRED
                        if (employementTypeText.includes("Retired")) {
                            cy.wrap(page)
                                .find('[data-placeholder="Employer Name"]')
                                .type("HCL");
                            cy.get('[class="btn send-otp employment-button"').first().click();
                            cy.get('[class="btn send-otp employment-button"').first().click();

                            // Enter Date for Employement Type STUDENT
                        } else if (employementTypeText.includes("Student")) {
                            // Enter Qualification
                            cy.get('[data-placeholder="Qualification"]').type("B.Tech");

                            // Enter Coborrower name
                            cy.get('[ng-reflect-name="coborrowername"]').type("Hello World");
                            cy.wrap(page)
                                .find('[formcontrolname="currencyId"]')
                                .first()
                                .then((currencyDropdown) => {
                                    cy.wrap(currencyDropdown).click();

                                    cy.get('[role="option"] span').each((currencyDropdown) => {
                                        const currencyText = currencyDropdown.text().trim();
                                        cy.log("Currency: " + currencyText);

                                        if (currencyText.includes("Currency")) {
                                            cy.wrap(currencyDropdown).click();
                                        } else if (
                                            currencyText.includes(this.setOnboardData.CountryCurrency.USD)
                                        ) {
                                            cy.wrap(currencyDropdown).click();
                                        }
                                    });
                                });

                            // Enter Coborrower income
                            cy.get('[ng-reflect-name="coborrowerincome"]').type("10000000");

                            // Clicking on the Proceed Button
                            cy.get('div[class="row"] button[type="submit"]').click();

                            // Enter Date for Employement Type SELF EMPLOYED
                        } else if (employementTypeText.includes("Self Employed")) {
                            // Clicking on the Calender Button
                            cy.wait(1000);
                            cy.get('[aria-label="Open calendar"]').last().click();
                            cy.get('[aria-label="Choose month and year"]').click();
                            cy.get(".mat-calendar-previous-button").click();

                            // Start Date of Current Profession
                            // Getting all calender years
                            cy.get('[class="mat-calendar-body"]').then((calenderYearData) => {
                                cy.wrap(calenderYearData)
                                    .find('[role="gridcell"] div')
                                    .each((calenderYears) => {
                                        // cy.wrap(calenderYears).find("");
                                        const years = calenderYears.text().trim();
                                        cy.log("Years : " + years);

                                        if (years.includes(this.setOnboardData.selectYear)) {
                                            // Select year
                                            cy.wrap(calenderYears).click({ force: true });

                                            // cy.wait(5000);
                                            cy.get('[mat-calendar-body][class="mat-calendar-body"]').then(
                                                (calnderMonthsData) => {
                                                    cy.wrap(calnderMonthsData)
                                                        .find('td[role="gridcell"]')
                                                        .each((calnderMonth) => {
                                                            const months = calnderMonth.text().trim();
                                                            // cy.log("Months : " + months);

                                                            // Select month
                                                            if (months.includes(this.setOnboardData.selectMonth)) {
                                                                cy.wrap(calnderMonth).click({ force: true });

                                                                cy.get('[class="mat-calendar-body"]').then(
                                                                    (calenderDateData) => {
                                                                        cy.wrap(calenderDateData)
                                                                            .find('[role="gridcell"]')
                                                                            .each((calenderDates) => {
                                                                                const date = calenderDates.text().trim();
                                                                                // cy.log("Date : " + date);
                                                                                if (
                                                                                    date.includes(this.setOnboardData.selectDate)
                                                                                ) {
                                                                                    cy.wrap(calenderDates).click({
                                                                                        force: true,
                                                                                    });

                                                                                    // Enter Company Name
                                                                                    cy.get(
                                                                                        '[data-placeholder="Company Name"]'
                                                                                    ).type("HCL");

                                                                                    // Enter Last year's PAT
                                                                                    cy.get("#mat-input-5").type("54000");

                                                                                    // Click on the Profession dropdown
                                                                                    cy.get('[role="combobox"]').last().click();

                                                                                    // Get all the profession types
                                                                                    cy.get('[role="option"]').each(
                                                                                        (professionTypesList) => {
                                                                                            const professionTypesText =
                                                                                                professionTypesList.text().trim();
                                                                                            cy.log(
                                                                                                "Profession Types : " +
                                                                                                professionTypesText
                                                                                            );

                                                                                            // Select the Profession Type
                                                                                            if (
                                                                                                professionTypesText.includes(
                                                                                                    this.setOnboardData.profession
                                                                                                )
                                                                                            ) {
                                                                                                cy.wrap(professionTypesList).click();
                                                                                                // Clicking on the Proceed Button
                                                                                                cy.get(
                                                                                                    '[class="btn send-otp employment-button"]'
                                                                                                ).click();
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            });
                                                                    }
                                                                );
                                                            }
                                                        });
                                                }
                                            );
                                        }
                                    });
                            });
                            // Enter Date for Employement Type SALARIED
                        } else if (employementTypeText.includes("Salaried")) {
                            cy.wrap(page)
                                .find('[data-placeholder="Employer Name"]')
                                .type("HCL");

                            // Selecting Currency Tyep
                            cy.wrap(page)
                                .find('[formcontrolname="currencyId"]')
                                .first()
                                .then((currencyDropdown) => {
                                    cy.wrap(currencyDropdown).click();

                                    // cy.get('[role="option"] span').each((currencyDropdown) => {
                                    //     const currencyText = currencyDropdown.text().trim();
                                    //     cy.log("Currency: " + currencyText);

                                    //     if (currencyText.includes("Currency")) {
                                    //         cy.wrap(currencyDropdown).click();
                                    //     } else if (
                                    //         currencyText.includes(this.setOnboardData.CountryCurrency.USD)
                                    //     ) {
                                    //         cy.wrap(currencyDropdown).click();
                                    //     }
                                    // });
                                });
                            // Entering Monthly Income Amount
                            cy.get('[id="mat-input-4"]').type("50000");

                            // Entering Employee ID
                            cy.get('[data-placeholder="Employee ID"]').type("IM1599");

                            // Clicking on the Proceed Button
                            cy.get('[class="btn send-otp employment-button"]').click();
                        }
                    }
                });

            cy.wrap(page)
                .find(
                    '[class="form-title-section document-section-title ng-star-inserted"]'
                )
                .should("contain", " Let’s get your documents")
                .and("contain", "Make sure the document is visible and text is readable");

            cy.get('[class="custom-file-input form-control"]').then((uploadDocs) => {
                cy.wrap(uploadDocs)
                    .get('[class="documentLabel"]')
                    .each((documentList) => {
                        const documentName = documentList.text().trim();
                        cy.log("Document Name: " + documentName);

                        let documentLength = uploadDocs.length;
                        cy.log("Document Length: " + documentLength);

                        // Upload documents based on length
                        if (documentLength == 3) {
                            cy.wait(2000);
                            cy.get('[class="custom-file"]')
                                .eq(0)
                                .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                            cy.get('[class="custom-file"]')
                                .eq(1)
                                .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                            cy.get('[class="custom-file"]')
                                .eq(2)
                                .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                        }
                        //  Uplpload 2 documents
                        else if (documentLength == 2) {
                            cy.get('[class="custom-file"]')
                                .eq(0)
                                .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                            cy.get('[class="custom-file"]')
                                .eq(1)
                                .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                        }
                        //  Uplpload 1 documents
                        else if (documentLength == 1) {
                            cy.get('[class="custom-file"]')
                                .eq(0)
                                .selectFile("cypress\\e2e\\UploadDocs\\sample.pdf");
                        }
                    });
                cy.wait(1000);

                // Click on Proceed button
                cy.get(".btn").click();
            });

            cy.wrap(page)
                .find('[class="form-title-section ng-star-inserted"]')
                .should("contain", " Finally! Set a password ")
                .and("contain", "Set a strong one like you");

            // Enter password
            cy.wrap(page)
                .find('[formcontrolname="password"]')
                .type(this.setOnboardData.password);

            // Enter confirm password
            cy.wrap(page)
                .find('[formcontrolname="confirmPassword"]')
                .type(this.setOnboardData.confirmPassword);

            // Click on Proceed button
            cy.wrap(page)
                .find('[class="btn send-otp password-submit-button"]')
                .click();

            // Upload profile image
            cy.wrap(page)
                .find('[class="custom-file"]')
                .selectFile("cypress\\e2e\\UploadDocs\\avtar.jpeg");

            // Click on Proceed button
            cy.wrap(page).find('[class="btn send-otp"]').click();
            cy.wait(3000)

            // Validate use details

            // Verify username
            // cy.wrap(page).find('[class="col-md-3"]').eq(0).should('contain', this.setOnboardData.firstName + ' ' + this.setOnboardData.lastName)

            // Verify father name
            // cy.wrap(page).find('[class="col-md-3"]').eq(1).should('contain', this.setOnboardData.fatherName)

            // Verify date of birth
            // cy.wrap(page).find('[class="col-md-3"]').eq(2).should('contain', this.setOnboardData.selectDate)

            // Verify gender
            // cy.wrap(page).find('[class="col-md-3"]').eq(3).should('contain', this.setOnboardData.gender)

            // Verify mobile number
            // cy.wrap(page).find('[class="col-md-3"]').eq(4).should('contain', this.setOnboardData.mobileNumber)

            // Click on Done button
            cy.scrollTo('bottom')
            // cy.wrap(page).find('[class="btn send-otp"]').click()

            // Validate username on Success message
            // cy.get('.mt-5').should('contain', this.setOnboardData.firstName)

            // Validate green ticker on Success message
            // cy.get('[class="success-green-tick"]').should('be.visible')

            // Click on Done button
            // cy.wrap(page).find('[class="btn send-otp"]').click()
        })


    });
});
