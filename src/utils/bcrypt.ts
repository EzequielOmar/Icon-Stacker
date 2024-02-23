const bcrypt = require("bcrypt");

export function hashPassword(password: string) {
  return bcrypt.hash(
    password,
    parseInt(process.env.REACT_APP_HASH_SALTS || "10")
  );
}

export function comparePasswords(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
