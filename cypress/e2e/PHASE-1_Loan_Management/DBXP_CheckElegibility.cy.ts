describe("Check Elegibility", () => {
  before("Read Data From Fixture File", () => {
    // Read Data From Fixture File
    cy.fixture("Login.json").then((setLoginData) => {
      // Take Sigle File From (LoginData) Fixture File
      this.loginData = setLoginData;
    });

    cy.fixture("CheckElegibility.json").then((getCheckElegibilityData) => {
      // Take Sigle File From (ApplyLoan.json) Fixture File
      this.checkElegibilityData = getCheckElegibilityData;
    });
  });

  beforeEach("Login", () => {
    cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
  });

  it("TC_01 -> Navigate on Check Elegibility Page", () => {
    // Click on the Loan icon on Home Page
    cy.get('[ng-reflect-router-link="manage-loan"] img').click();
    // Click on the Check Elegibility button
    cy.get('button[routerlink="check-eligibility"]').click(); // Click on the Check Elegibility [New User]
    cy.wait(2500);
    cy.get('[class="h-Enter-Details mt-4 ng-star-inserted"]').should("contain", "Enter your details");

    // Click on the Loan Type dropdown
    cy.get("form").find("div.form-div").first().then((checkElegibilityCard) => {
      cy.wrap(checkElegibilityCard).find('[class="mat-select-trigger ng-tns-c96-11"]').click({ force: true });

      cy.get('[role="option"] span').each((loanTypes) => {
        const loanTypeText = loanTypes.text().trim();
        // cy.log("Types of Loan : " + loanTypeText)

        if (loanTypeText.includes(this.checkElegibilityData.LoanTypes.Home)) {
          cy.wrap(loanTypes).click();
          cy.get('[class="mat-select-trigger ng-tns-c96-11"]').should("contain", this.checkElegibilityData.LoanTypes.Home);
          cy.log("Use enters PAN Number : " + this.checkElegibilityData.EnterPaNNumber);
        }
      });
    });

    cy.get('[formcontrolname="selectCurrency"]').then((currencyDropdown) => {
      cy.wrap(currencyDropdown).click({ force: true });
      // cy.log("user is clicked on Currency dropdown");
      cy.scrollTo("top");
      // Getting currency types (Text)
      cy.get('[role="option"]').each((currencyType) => {
        const currencyTypeText = currencyType.text().trim();
        // cy.log("Currency Type is : " + currencyTypeText);

        if (currencyTypeText.includes(this.checkElegibilityData.CountryCurrency.LAK)) {
          cy.wrap(currencyType).click({ force: true });
          cy.wrap(currencyType).should("contain", currencyTypeText);
          cy.log("User is selected : " + currencyTypeText);
        }
      });
    });

    // Enter the amount
    cy.get('[ng-reflect-name="loanAmount"]').clear({ force: true }).type(this.checkElegibilityData.enterAmount);

    cy.get("form").find("div.form-div").first().then((checkElegibilityCard) => {
      //    Enter the PAN Number
      cy.wrap(checkElegibilityCard).find('[formcontrolname="panNumber"]').type(this.checkElegibilityData.PanNumber);
      cy.wrap(checkElegibilityCard).find('[formcontrolname="panNumber"]').type(this.checkElegibilityData.PanNumber);
      cy.log("User's entered PAN Number : " + this.checkElegibilityData.PanNumber);

      // Click on checkbox
      cy.wrap(checkElegibilityCard).find('[class="mat-checkbox-inner-container"] [type="checkbox"]').should("not.be.checked");
      cy.wrap(checkElegibilityCard).find('[class="mat-checkbox-inner-container"] [type="checkbox"]').check({ force: true });
      cy.wrap(checkElegibilityCard).find('[class="mat-checkbox-inner-container"] [type="checkbox"]').should("be.checked");

      // Click on the Proceed Button
      cy.wrap(checkElegibilityCard).find('[class="col-md-6"] button').click();
    });

    // Navigate to check-eligibility -> Employement Tyep page
    cy.get('[class="additional-details-div ng-star-inserted"]').should("contain", "Enter your additional details");
    cy.get('[class="check-eligibility-card"]').then((checkEligibilityCard) => {
      // Click on the Employement Type dropdown
      cy.wait(1000);
      cy.wrap(checkEligibilityCard).find('[role="combobox"]').click();
      // Getting all employement types text
      cy.get('[role="option"] span').each((employmentTypes) => {
        const employmentTypeText = employmentTypes.text().trim();
        // cy.log("Employement Type is :" + employmentTypeText);
        const employmentType = this.checkElegibilityData.EmployementTypes.SelfEmployed;

        if (employmentTypeText.includes(employmentType)) {
          cy.wrap(employmentTypes).click();

          // Enter Date for Employement Type RETIRED
          if (employmentTypeText.includes("Retired")) {
            cy.get('[ng-reflect-placeholder="Employer Name"]').type("HCL");
            // Clicking on the Proceed Button
            cy.get('button[class="mat-focus-indicator proceed-btn mat-stroked-button mat-button-base"]').click();

            // Enter Date for Employement Type STUDENT
          } else if (employmentTypeText.includes("Student")) {
            // Enter Qualification
            cy.get('[data-placeholder="Qualification"]').type("B.Tech");
            //  Enter Coborrower name
            cy.get('[ng-reflect-name="coborrowername"]').type("Hello World");
            //  Enter Coborrower income
            cy.get('[ng-reflect-name="coborrowerincome"]').type("10000000");
            // Clicking on the Proceed Button
            cy.get('button[class="mat-focus-indicator proceed-btn mat-stroked-button mat-button-base"]').click();

            // Enter Date for Employement Type BUSINESS OWNER
          } else if (employmentTypeText.includes("Business Owner")) {
            cy.wait(1000);
            cy.get('[aria-label="Open calendar"]').click();
            cy.get('[aria-label="Choose month and year"]').click();
            // cy.wait(2000)

            // Getting all calender years
            cy.get('[class="mat-calendar-body"]').then((calenderYearData) => {
              cy.wrap(calenderYearData).find('[role="gridcell"] div').each((calenderYears) => {
                const years = calenderYears.text().trim();
                // cy.log("Years : " + years)

                if (years.includes(this.checkElegibilityData.selectYear)) {
                  // Select year
                  cy.wrap(calenderYears).click({ force: true });

                  // cy.wait(5000);
                  cy.get('[mat-calendar-body][class="mat-calendar-body"]').then((calnderMonthsData) => {
                    cy.wrap(calnderMonthsData).find('td[role="gridcell"]').each((calnderMonth) => {
                      const months = calnderMonth.text().trim();
                      // cy.log("Months : " + months);

                      // Select month
                      if (months.includes(this.checkElegibilityData.selectMonth)) {
                        cy.wrap(calnderMonth).click({ force: true });

                        cy.get('[class="mat-calendar-body"]').then((calenderDateData) => {
                          cy.wrap(calenderDateData).find('[role="gridcell"]').each((calenderDates) => {
                            const date = calenderDates.text().trim();
                            // cy.log("Date : " + date);
                            if (date.includes(this.checkElegibilityData.selectDate)) {
                              cy.wrap(calenderDates).click({ force: true });
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            });

            // Enter company name
            cy.get('[ng-reflect-name="companyname"]').type("HCL");

            // Enter Last year's PAT
            cy.get('[ng-reflect-name="lastyearpat"]').type("54000");

            // Clicking on the Proceed Button
            cy.get('button[class="mat-focus-indicator proceed-btn mat-stroked-button mat-button-base"]').click();
            // Enter Date for Employement Type SELF EMPLOYED);
          } else if (employmentTypeText.includes("Self Employed")) {
            // Clicking on the Calender Button
            cy.wait(1000);
            cy.get('[aria-label="Open calendar"]').click();
            cy.get('[aria-label="Choose month and year"]').click();
            // cy.wait(2000)

            // Start Date of Current Profession
            // Getting all calender years
            cy.get('[class="mat-calendar-body"]').then((calenderYearData) => {
              cy.wrap(calenderYearData).find('[role="gridcell"] div').each((calenderYears) => {
                const years = calenderYears.text().trim();
                // cy.log("Years : " + years)

                if (years.includes(this.checkElegibilityData.selectYear)) {
                  // Select year
                  cy.wrap(calenderYears).click({ force: true });

                  // cy.wait(5000);
                  cy.get('[mat-calendar-body][class="mat-calendar-body"]').then((calnderMonthsData) => {
                    cy.wrap(calnderMonthsData).find('td[role="gridcell"]').each((calnderMonth) => {
                      const months = calnderMonth.text().trim();
                      // cy.log("Months : " + months);

                      // Select month
                      if (months.includes(this.checkElegibilityData.selectMonth)) {
                        cy.wrap(calnderMonth).click({ force: true });

                        cy.get('[class="mat-calendar-body"]').then((calenderDateData) => {
                          cy.wrap(calenderDateData).find('[role="gridcell"]').each((calenderDates) => {
                            const date = calenderDates.text().trim();
                            // cy.log("Date : " + date);
                            if (date.includes(this.checkElegibilityData.selectDate)) {
                              cy.wrap(calenderDates).click({ force: true });

                              // Enter Company Name
                              cy.get('[data-placeholder="Company Name"]').type("HCL");
                              // Enter Last year's PAT
                              cy.get('[ng-reflect-name="lastyearpat"]').type("54000");

                              //  Click on the Profession dropdown

                              cy.get('[class="mat-form-field-infix ng-tns-c93-27"]').click();

                              // Get all the profession types
                              cy.get('[role="option"]').each((professionTypesList) => {
                                const professionTypesText = professionTypesList.text().trim();
                                cy.log("Profession Types : " + professionTypesText);

                                //  Select the Profession Type
                                if (professionTypesText.includes(this.checkElegibilityData.selectProfession)) {
                                  cy.wrap(professionTypesList).click();
                                  // Clicking on the Proceed Button
                                  cy.get('button[class="mat-focus-indicator proceed-btn mat-stroked-button mat-button-base"]').click();
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
          }
        }
      });
    });
    cy.get("div.success-msg-main-div").then((successMessageCard) => {
      cy.wrap(successMessageCard).get("div.first-heading").should("be.visible").and("contain", this.checkElegibilityData.SuccessMessage);
      cy.log("Success Message : " + this.checkElegibilityData.SuccessMessage);
      cy.wrap(successMessageCard).get("div.first-title").should("be.visible").and("contain", this.checkElegibilityData.description);
      cy.log("Description : " + this.checkElegibilityData.description);
      cy.wrap(successMessageCard).find('[class="first-heading mb-3"]').then((appicationNumber) => {
        const number = appicationNumber.text().trim();
        cy.log("Appication Number : " + number);
        cy.wrap(appicationNumber).should("contain", number);
      });

      //  Verify that the application status
      cy.wrap(successMessageCard).find('[class="second-title service-id mb-0"]').should("contain", " Application in process");
    });
  });
});
