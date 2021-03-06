import {
  Body,
  Req,
  Res,
  Controller,
  HttpCode,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './interfaces/requestWithUser.interface';
import RequestWithUserWithId from './interfaces/requestWithUserWithId.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(
    @Req() request: RequestWithUserWithId,
    @Res() response: Response,
  ) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user._id);
    response.setHeader(
      'Access-Control-Allow-Origin',
      process.env.FRONTEND_DOMAIN,
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    response.setHeader('Access-Control-Expose-Headers', 'token');
    response.setHeader('token', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
