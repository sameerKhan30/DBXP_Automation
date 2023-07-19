describe("Profle & Information", () => {
    before("Read Data From Fixture File", () => { // Read Data From Fixture File
        cy.fixture("Login.json").then((setLoginData) => { // Take Sigle File From (LoginData) Fixture File
            this.loginData = setLoginData;
        });
    });

    beforeEach("Login", () => {
        cy.login(this.loginData.IM.userName, this.loginData.IM.userPassword, "Login");
        // cy.wait(6000)
    })

    it("Add/UpdateDelete Nickname", () => {

        cy.get('[id="dropdownMenuLink"]').click();

        cy.get('[class="dropdown-menu show"] [class="dropdown-item"]').each((item) => {
            const dropdDownItems = item.text().trim();
            cy.log(dropdDownItems);
            const selectDropdItems = "My Profile";
            if (dropdDownItems.includes(selectDropdItems)) {
                cy.wait(1000)
                cy.wrap(item).click();
                cy.scrollTo(0, 1700)
            }
        })
    })




})



