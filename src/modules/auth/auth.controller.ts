import { Body, Controller, Get, HttpCode, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuardJWT } from 'src/config/guards/auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PasswordRequestResetDto } from './dto/password-request-reset.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({
  version: '1'
})
export class AuthController
{
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logeed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto)
  {
    return this.authService.login(loginDto);
  }

  @Get('auth/user')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  user(@Req() request)
  {
    return this.authService.user(request.user);
  }

  @Get('auth/refresh')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  refresh(@Req() request)
  {
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('Token not provide');
    }

    return this.authService.refresh(request.user, token);
  }

  @Post('auth/logout')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  logout(@Req() request)
  {
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('Token not provide');
    }

    this.authService.logout(token);
    return { message: 'Logout success' };
  }

  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data' })
  register(@Body() createUserDto: CreateUserDto)
  {
    return this.authService.register(createUserDto);
  }

  @Get('auth/verify/:id/:hash')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification link' })
  @ApiResponse({ status: 409, description: 'Email already verified' })
  verify(@Param('id') id: number, @Param('hash') hash: string)
  {
    return this.authService.verify(+id, hash);
  }


  @Post('auth/password-reset/request')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset request sent' })
  passwordRequestReset(@Body() passwordRequestResetDto: PasswordRequestResetDto)
  {
    return this.authService.passwordRequestReset(passwordRequestResetDto);

  }

  @Post('auth/password-reset/recovery')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid email or user not found' })
  passwordReset(@Body() passwordResetDto: PasswordResetDto)
  {
    return this.authService.passwordReset(passwordResetDto);
  }
}
