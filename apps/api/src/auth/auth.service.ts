import { Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  async login(email: string, password: string): Promise<string> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    const secret = process.env.AUTH_SECRET;
    if (!adminEmail || !adminHash || !secret) {
      throw new UnauthorizedException("Servidor sin configurar (.env)");
    }
    const ok =
      email === adminEmail && (await bcrypt.compare(password ?? "", adminHash));
    if (!ok) throw new UnauthorizedException("Credenciales inválidas");
    return jwt.sign({ email }, secret, { expiresIn: "7d" });
  }

  verify(token?: string): boolean {
    const secret = process.env.AUTH_SECRET;
    if (!token || !secret) return false;
    try {
      jwt.verify(token, secret);
      return true;
    } catch {
      return false;
    }
  }
}
