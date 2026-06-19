import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.auth.login(body?.email, body?.password);
    // En producción la web y la API están en dominios distintos → la cookie debe ser
    // SameSite=None + Secure para que el navegador la envíe en peticiones cross-site.
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("session", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { ok: true };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("session", {
      path: "/",
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });
    return { ok: true };
  }

  @Get("me")
  me(@Req() req: Request) {
    const token = (req as Request & { cookies?: Record<string, string> })
      .cookies?.session;
    return { authenticated: this.auth.verify(token) };
  }
}
