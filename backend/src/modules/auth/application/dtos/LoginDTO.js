export class LoginDTO {
  constructor({ email, password }) {
    this.email = email?.trim().toLowerCase();
    this.password = password;
  }
}