import loginPage from "../support/pages/login/index";
import dashPage from "../support/pages/dash/index";
describe("Login", () => {
  context("Quando o usuário é novato", () => {
    const user = {
      name: "Begas Silva",
      email: "begas@email.com",
      password: "123456",
      is_provider: true,
    };

    before(() => {
      cy.task("deleteUser", user.email).then((resultado) => {
        console.log(resultado);
      });

      cy.request({
        method: "POST",
        url: "http://localhost:3333/users",
        body: user,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("name", user.name);
        expect(response.body).to.have.property("email", user.email);
      });
    });

    it("Deve logar com sucesso", () => {
      loginPage.go();
      loginPage.form(user);
      loginPage.submit();

      dashPage.header.userLoggedIn(user.name);
    });
  });
});
