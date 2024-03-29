import { Controller, Get, Res, Redirect, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Redirects user to linked in login/consent page
  @Get('linkedin')
  @Redirect()
  async linkedin() {
    const redirect_uri = "http://localhost:3000/auth/callback";
    let code_url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=openid%20email%20profile`
    let _res = await axios.get(code_url)
    return { url: _res.request.res.responseUrl }
  }
  // callback url to validate user and send jwt cookie
  @Get('callback')
  async callback(@Query('code') code, @Res({ passthrough: true }) res: Response) {
    return await this.authService.callback(res, code)
  }
}

