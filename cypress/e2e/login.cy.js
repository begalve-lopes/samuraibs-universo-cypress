import loginPage from "../support/pages/login/index";
import dashPage from "../support/pages/dash/index";
describe("Login", () => {
  context("Quando o usuário é novato", () => {
    const user = {
      name: "Begas Silva",
      email: "begas@email.com",
      password: "123456",
    };
    it("Deve logar com sucesso", () => {
      loginPage.go();
      loginPage.form(user);
      loginPage.submit();

      dashPage.header.userLoggedIn(user.name);
    });
  });
});
