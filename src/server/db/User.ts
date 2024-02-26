import { prisma } from "./_client";
import { comparePasswords, hashPassword } from "@/utils/bcrypt";

export interface publicUser {
  id: string;
  email: string;
  name: string | null;
  last_name: string | null;
  picture: string | null;
}

function parsePublicUser(user: any): publicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    last_name: user.last_name ?? null,
    picture: user.image ?? null,
  };
}

export default class User {
  static async createUser(email: string, password: string) {
    try {
      const hash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hash,
        },
      });
      return parsePublicUser(user);
    } catch (error) {
      throw new Error(`Fail on User Creation`);
    }
  }

  static async createProviderUser(
    email: string,
    name = null,
    last_name = null,
    picture = null
  ) {
    try {
      const user = await prisma.user.create({
        data: {
          email: email,
          name: name,
          last_name: last_name,
          picture: picture,
          from_provider: true,
        },
      });
      return parsePublicUser(user);
    } catch (error) {
      throw new Error(`Fail on Provider User Creation`);
    }
  }

  static async checkUserByEmailAndPassword(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (
        user &&
        (await comparePasswords(password || "", user.password || ""))
      ) {
        return parsePublicUser(user);
      }
      return null;
    } catch (error) {
      throw new Error(`Fail on Check User By Email/Password`);
    }
  }

  static async checkUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      return user ? parsePublicUser(user) : null;
    } catch (error) {
      throw new Error(`Fail on Check User By Email`);
    }
  }
}