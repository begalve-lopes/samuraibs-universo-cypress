import forgotPassPage from "../support/pages/forgotpass";
import resetPassPage from "../support/pages/resetpass";

describe("resgate de senha", function () {
  before(function () {
    cy.fixture("recovery").then(function (recovery) {
      this.recovery = recovery;
    });
  });

  context("quando o usuário esquece a senha", function () {
    before(function () {
      cy.postUser(this.recovery);
    });

    it("deve ser possível resgatar a senha por email", function () {
      forgotPassPage.go();
      forgotPassPage.from(this.recovery.email);
      forgotPassPage.submit();
      forgotPassPage.toast.shouldHaveText(
        "Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada.",
      );
    });
  });

  context("quando o usuário solicita o resgate de senha", function () {
    before(function () {
      cy.postUser(this.recovery);
      cy.recoveryPass(this.recovery.email);
    });

    it("deve poder cadastrar uma nova senha", function () {
      const token = cy.get("@recoveryToken");
      expect(token).to.not.be.undefined;

      resetPassPage.go(token);
      resetPassPage.form("123456", "123456");
      resetPassPage.submit();

    //   resetPassPage.toast.shouldHaveText(
    //     "Agora você já pode logar com a sua nova senha secreta.",
    //   );
    });
  });
});
