// import { before } from "node:test";

describe("Apply Loan Automation", () => {
  before("Read Data From Fixture File", () => {
    // Read Data From Fixture File
    cy.fixture("Login.json").then((setLoginData) => {
      // Take Sigle File From (LoginData) Fixture File
      this.loginData = setLoginData;
    });
    cy.fixture("ApplyLoan.json").then((setApplyLoanData) => {
      // Take Sigle File From (ApplyLoan.json) Fixture File
      this.applyLoanData = setApplyLoanData;
    });
  });
  beforeEach("Login", () => {
    cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
    // cy.login(this.loginData.IM.IM, this.loginData.IM.userPassword, "Verify Login for Apply Loan");
  });

  it("Validate Apply Loan", () => {

    // Clicking on Loan button on Home Page
    cy.get('[ng-reflect-router-link="manage-loan"] img').click();

    // Clicking on Apply loan button (New User)
    cy.get('[routerlink="apply-loan"').click();
    // cy.get('[class="row"] [routerlink="apply-loan"]').click();

    // cy.get('[class="text-center"]').click() // Incase when we have already laon (ADD LOAN BUTTON)


    // Enter your additional details - PAGE (1)

    // Verifying "Enter your additional details" title
    cy.get('[class="row pt-0 ng-star-inserted"] [class="h-Enter-Details"]').first().scrollIntoView().should("be.visible");
    cy.log("User successfully navigate on the Enter your details page");

    // Getting all the element of enter your details page in "form" variable
    cy.get('[class="loan-card ng-star-inserted"] [class="loan-card-body"]').find("form").then((form) => {
      // Verifying the user detail fields
      cy.wrap(form).find('[formcontrolname="name"]').should("be.visible");
      cy.wrap(form).find('[formcontrolname="name"]').should("be.visible");
      cy.wrap(form).find('[formcontrolname="dob"]').should("be.visible");
      cy.wrap(form).find('[formcontrolname="mobile"]').should("be.visible");

      // Verifying that Pan Number field is empty
      cy.wrap(form).find('[formcontrolname="panNumber"]').should("be.empty");

      // Entering PAN Number
      cy.wrap(form).find('[formcontrolname="panNumber"]').type(this.applyLoanData.PanNumber);
      cy.log("Entered PAN Number : " + this.applyLoanData.PanNumber);

      // Verifying that the validation icon is visible
      cy.get('img[class="right-tick-img ng-star-inserted"').should("be.visible");
      cy.log("PAN Number verified successfully !");

      // Clicking on the Checkbox
      cy.wrap(form).find('[formcontrolname="checked"] [type="checkbox"]').should("not.be.checked");
      cy.wrap(form).find('[formcontrolname="checked"] [type="checkbox"]').check({ force: true });
      cy.wrap(form).find('[formcontrolname="checked"] [type="checkbox"]').should("be.checked");

      // Clicking on the Proceed button
      cy.wrap(form).find('[class="col-md-2 proceed-right-alignment"] [type="submit"]').should("be.enabled");
      cy.wrap(form).find('[class="col-md-2 proceed-right-alignment"] [type="submit"]').click();

      // Enter your additional details - PAGE (2)

      // Verifying "Enter your details" title
      cy.get('[class="row ng-star-inserted"] [class="h-Enter-Details"]').should("contain", "Enter your additional details");

      // Getting page elements
      cy.get('[class="loan-card-body pl-3"]').find("form").then((form) => {
        //  Clicking on the Employment Type dropdown
        // cy.wait(2000)
        cy.wrap(form).find('[formcontrolname="employeeType"]').then((employementTypeDropdown) => {
          // Clicking on the Employee Type dropdown
          cy.wrap(employementTypeDropdown).click();
          cy.log("User clicked on Employment Type dropdown");

          //  Getting all the Employment Types after click (dropdDownValue)
          cy.get('[role="option"]').each((employementDropDownValues) => {
            // Dropdown text is stored in the "employementTypeText" variable
            const employementTypeText = employementDropDownValues.text().trim();
            // cy.log("Employment type is : " + employementTypeText);

            // Provide Loan Type drop
            const chooseEmployementType = this.applyLoanData.EmployementTypes.Retired;
            if (employementTypeText.includes(chooseEmployementType)) {
              cy.wrap(employementDropDownValues).click();

              // Enter Date for Employement Type RETIRED -----------------------------------------------------------------------------
              if (employementTypeText.includes("Retired")) {
                cy.wrap(form).find('[data-placeholder="Employer Name"]').type("HCL");
                cy.get('[class="col-md-4 d-flex justify-content-around p-3"]  button.proceed-btn').first().click();

                // Enter Date for Employement Type STUDENT ---------------------------------------------------------------------------
              } else if (employementTypeText.includes("Student")) {
                // Enter Qualification
                cy.get('[data-placeholder="Qualification"]').type("B.Tech");

                //  Enter Coborrower name
                cy.get('[ng-reflect-name="coborrowername"]').type("Hello World");

                cy.wrap(form).find('[formcontrolname="currencyId"]').first().then((currencyDropdown) => {
                  cy.wrap(currencyDropdown).click();

                  cy.get('[role="option"] span').each((currencyDropdown) => {
                    const currencyText = currencyDropdown.text().trim();
                    cy.log("Currency: " + currencyText);

                    if (currencyText.includes("Currency")) {
                      cy.wrap(currencyDropdown).click();
                    } else if (currencyText.includes(this.applyLoanData.CountryCurrency.USD)) {
                      cy.wrap(currencyDropdown).click();
                    }
                  });
                });

                //  Enter Coborrower income
                cy.get('[ng-reflect-name="coborrowerincome"]').type("10000000");

                // Clicking on the Proceed Button
                cy.get('div[class="row"] button[type="submit"]').click();

                // Enter Date for Employement Type SELF EMPLOYED -----------------------------------------------------------------
              } else if (employementTypeText.includes("Self Employed")) {
                // Clicking on the Calender Button
                cy.wait(1000);
                cy.get("button[class='mat-focus-indicator mat-icon-button mat-button-base']").click();
                cy.get('[aria-label="Choose month and year"]').click();
                // cy.wait(2000)

                // Start Date of Current Profession
                // Getting all calender years
                cy.get('[class="mat-calendar-body"]').then((calenderYearData) => {
                  cy.wrap(calenderYearData).find('[role="gridcell"] div').each((calenderYears) => {
                    const years = calenderYears.text().trim();
                    // cy.log("Years : " + years)

                    if (years.includes(this.applyLoanData.selectYear)) {
                      // Select year
                      cy.wrap(calenderYears).click({ force: true });

                      // cy.wait(5000);
                      cy.get('[mat-calendar-body][class="mat-calendar-body"]').then((calnderMonthsData) => {
                        cy.wrap(calnderMonthsData).find('td[role="gridcell"]').each((calnderMonth) => {
                          const months = calnderMonth.text().trim();
                          // cy.log("Months : " + months);

                          // Select month
                          if (months.includes(this.applyLoanData.selectMonth)) {
                            cy.wrap(calnderMonth).click({ force: true });

                            cy.get('[class="mat-calendar-body"]').then((calenderDateData) => {
                              cy.wrap(calenderDateData).find('[role="gridcell"]').each((calenderDates) => {
                                const date = calenderDates.text().trim();
                                // cy.log("Date : " + date);
                                if (date.includes(this.applyLoanData.selectDate)) {
                                  cy.wrap(calenderDates).click({ force: true });

                                  // Enter Company Name
                                  cy.get('[data-placeholder="Company Name"]').type("HCL");
                                  // Enter Last year's PAT
                                  cy.get('[ng-reflect-name="lastyearpat"]').type("54000");

                                  //  Click on the Profession dropdown
                                  cy.get('[role="combobox"][ng-reflect-placeholder="Select your Profession"]').click();

                                  // Get all the profession types
                                  cy.get('[role="option"]').each((professionTypesList) => {
                                    const professionTypesText = professionTypesList.text().trim();
                                    cy.log("Profession Types : " + professionTypesText);

                                    //  Select the Profession Type
                                    if (professionTypesText.includes(this.applyLoanData.selectProfession)) {
                                      cy.wrap(professionTypesList).click();
                                      // Clicking on the Proceed Button
                                      cy.get('div[class="row"] button[type="submit"]').click();
                                    }
                                  });
                                }
                              });
                            });
                          }
                        });
                      });
                    }
                  });
                });
                // Enter Date for Employement Type SALARIED -----------------------------------------------------------------
              } else if (employementTypeText.includes("Salaried")) {
                cy.wrap(form).find('[data-placeholder="Employer Name"]').type("HCL");

                // Selecting Currency Tyep
                cy.wrap(form).find('[formcontrolname="currencyId"]').first().then((currencyDropdown) => {
                  cy.wrap(currencyDropdown).click();

                  cy.get('[role="option"] span').each((currencyDropdown) => {
                    const currencyText = currencyDropdown.text().trim();
                    cy.log("Currency: " + currencyText);

                    if (currencyText.includes("Currency")) {
                      cy.wrap(currencyDropdown).click();
                    } else if (currencyText.includes(this.applyLoanData.CountryCurrency.USD)) {
                      cy.wrap(currencyDropdown).click();
                    }
                  });
                });
                // Entering Monthly Income Amount
                cy.get('[ng-reflect-name="monthlyincome"]').type("50000");

                // Entering Employee ID
                cy.get('[ng-reflect-placeholder="Employee ID"]').type("IM1599");

                // Clicking on the Proceed Button
                cy.get('div[class="row"] button[type="submit"]').click();
              }
            }
          });
        });
      });
    });

    cy.get('[class="loan-card ng-star-inserted"]').find('[class="loanDetails ng-untouched ng-pristine ng-invalid"]').then((loanCard) => {
      cy.wait(1000);
      // cy.scrollTo('bottom', { ensureScrollable: true })
      cy.wrap(loanCard).find("#mat-select-6").click({ force: true });
      cy.get('[role="option"] span').each((loanDropdown) => {
        const loanTypeText = loanDropdown.text().trim();
        cy.log("Loan type: " + loanTypeText);

        if (loanTypeText.includes(this.applyLoanData.LoanType.PersonalLoan)) {
          cy.wrap(loanDropdown).click();
        }
      });
      // cy.wait(2000);
      // Enter amount
      cy.wrap(loanCard).find('[formcontrolname="loanAmount"]').clear({ force: true }).type("50000");
      // cy.wait(2000);

      const amount = this.applyLoanData.LoanAmount
      if (amount >= 100000 && amount <= 1100000) {
        cy.wrap(loanCard).find('[class="text-tenure-box"] input').clear().type(amount);
        cy.log("User entered amount : " + amount);
      }
      cy.wrap(loanCard).find("#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container").click();
      // cy.wrap(loanCard).find('[class="col-md-4 d-flex justify-content-around p-3 proceed-right-alignment-loan-type"] [class="mat-focus-indicator mat-stepper-next proceed-btn mat-stroked-button mat-button-base"]').click()
      cy.wrap(loanCard).find('button[type="submit"] [class="mat-button-wrapper"]').click()
      cy.log("User clicked on Prceed button")
    });


    // Enter your additional details - PAGE (3) Purpose of Loan
    cy.get('[class="row ng-star-inserted"] [class="h-Enter-Details"]').eq(2).should("contain", " Enter additional details ")
    cy.get('[class="loan-card ng-star-inserted"]').then((loanPurpose) => {
      cy.wrap(loanPurpose).find('[formcontrolname="loanPurpose"]').then((purposeDropdown) => {
        const purpose = purposeDropdown.text().trim()
        cy.log(purpose)

        if (purpose.includes("Choose purpose")) {
          cy.wrap(purposeDropdown).click()
          cy.log("User successfully clicked on the loan purpose dropdown");

          //  Getting all the purpose of the loan
          cy.get('[role="listbox"]').each((purposeLoanList) => {
            const purposeLoanListText = purposeLoanList.text().trim()
            // cy.log("Purpose of Loan :  " + purposeLoanListText)

            if (purposeLoanListText.includes(this.applyLoanData.purposeOfLoan)) {
              cy.wrap(purposeLoanList).click()
              // cy.log("User selected purpose of loan : " + purposeLoanListText)

              // Enter Father's name
              cy.get('[formcontrolname="fathersName"]').type(this.applyLoanData.fatherName)
              cy.log("User entered father's name : " + this.applyLoanData.fatherName)

              //Enter Mother's name
              cy.get('[formcontrolname="motherName"]').type(this.applyLoanData.motherName)
              cy.log("User enterd mother name : " + this.applyLoanData.motherName)

              // Click on Proceed button
              cy.get('[type="submit"]').eq(3).click();
              cy.log("User click successfully on the proceed button");
            }
          })
        }
      })
    })

    // Enter your additional details - PAGE (4) Address detsails
    cy.get('[class="h-Enter-Details"]').eq(4).should("be.visible");
    cy.log("User navigate successfully on the address page");

    cy.get('[class="loan-card ng-star-inserted"] [class="loan-card-body pl-3"]').then((addressPage) => {
      cy.wrap(addressPage).should('contain', 'Enter address')

      // Enter address
      // cy.wait(2000)
      cy.wrap(addressPage).find('[class="edit-button ng-star-inserted"]').first().click()
      cy.wrap(addressPage).find('[formcontrolname="address"]').clear().type("Dayal Bagh Agra")

      // Enter Pincode
      cy.wrap(addressPage).find('[class="edit-button ng-star-inserted"]').last().click()
      cy.wrap(addressPage).find('[formcontrolname="pincode"]').clear().type("560004")

      cy.wrap(addressPage)
        .find('[formcontrolname="currentAddress"] input')
        .scrollIntoView()
        .should("not.be.checked")
        .check({ force: true })
        .should("be.checked");

      //  Click on the proceed
      cy.wrap(addressPage)
        .find('div[class="checkBoxNproceed ml-1 mt-0"] button[type="submit"]')
        .click();
      cy.log("User successfully click on the proceed button");

    })

    // Enter your additional details - PAGE (5) Upload documents
    cy.get('[class="h-Enter-Details"]').eq(5).should("be.visible").and('contain', 'Provide all Documents')
    cy.log("User navigate successfully on the upload document page");

    cy.get('label input[type="file"]').then((uploadDocument) => {
      //  Getting the length of the document
      // let uploadDocumentLength = uploadDocument.length.toString();
      let uploadDocumentLength = uploadDocument.length
      cy.log("The length of the document is: " + uploadDocumentLength)


      //  Uplpload 3 documents
      if (uploadDocumentLength == 3) {
        cy.wait(2000)
        cy.get('[class="custom-file"]').eq(0).selectFile("C:\\Users\\manish.prajapati\\3D Objects\\DBXP Automation\\cypress\\e2e\\UploadDocs\\sample.pdf")
        cy.get('[class="successfully-msg ng-star-inserted"]').eq(0).should('be.visible').and('contain', ' Successfully uploaded ')
        cy.wait(2000)
        cy.get('[class="custom-file"]').eq(1).selectFile("cypress\\e2e\\UploadDocs\\kaung-myat-min-n39-bU4c5kQ-unsplash.jpg")
        cy.get('[class="successfully-msg ng-star-inserted"]').eq(1).should('be.visible').and('contain', ' Successfully uploaded ')
        cy.wait(2000)
        cy.get('[class="custom-file"]').eq(2).selectFile("C:\\Users\\manish.prajapati\\3D Objects\\DBXP Automation\\cypress\\e2e\\UploadDocs\\sample.pdf")
        cy.get('[class="successfully-msg ng-star-inserted"]').eq(2).should('be.visible').and('contain', ' Successfully uploaded ')
      }
      //  Uplpload 2 documents
      else if (uploadDocumentLength == 2) {
        // cy.wait(2000)
        cy.get('[class="custom-file"]').eq(0).selectFile("C:\\Users\\manish.prajapati\\3D Objects\\DBXP Automation\\cypress\\e2e\\UploadDocs\\sample.pdf")
        cy.get('[class="successfully-msg ng-star-inserted"]').eq(0).should('be.visible').and('contain', ' Successfully uploaded ')

        // cy.wait(2000)
        cy.get('[class="custom-file"]').eq(1).selectFile("cypress\\e2e\\UploadDocs\\kaung-myat-min-n39-bU4c5kQ-unsplash.jpg")
        cy.get('[class="successfully-msg ng-star-inserted"]').eq(1).should('be.visible').and('contain', ' Successfully uploaded ')
      }
      //  Uplpload 1 documents
      else if (uploadDocumentLength == 1) {
        cy.wait(2000)
        cy.get('[class="custom-file"]').eq(0).selectFile("C:\\Users\\manish.prajapati\\3D Objects\\DBXP Automation\\cypress\\e2e\\UploadDocs\\sample.pdf")
        cy.get('[class="successfully-msg ng-star-inserted"]').eq(0).should('be.visible').and('contain', ' Successfully uploaded ')
      }

      cy.wait(2000)
      //Clicking on the Submit button
      cy.get('.ng-untouched > .checkBoxNproceed > .row > .col-md-4 > .proceed-btn').scrollIntoView().click()
    })
  });
})
