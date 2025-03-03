import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuardJWT } from 'src/config/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TwoFactorAuthDto } from './dto/two-factor-auth.dto';

@ApiTags('Users')
@Controller({
  version: '1'
})
export class UsersController
{
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  create(@Body() createUserDto: CreateUserDto)
  {
    return this.usersService.create(createUserDto);
  }

  @Get('users')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a list of users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  findAll(@Query() queryParams: any)
  {
    return this.usersService.findAll(queryParams);
  }

  @Get('users/:id')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number)
  {
    return this.usersService.findOne(+id);
  }

  @Patch('users/:id')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto )
  {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('users/:id')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: number)
  {
    return this.usersService.remove(+id);
  }

  @Get('users/:id/two-factor-auth/generate')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a 2FA secret and QR code' })
  @ApiResponse({ status: 200, description: '2FA secret and QR code generated successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  generate2FA(@Param('id') id: number)
  {
    return this.usersService.generate2FA(id);
  }

  @Post('users/:id/two-factor-auth/enable')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable two factor authentication' })
  @ApiResponse({ status: 200, description: 'Two factor authentication enabled successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided, unauthorized or invalid 2FA code' })
  @ApiResponse({ status: 404, description: 'User not found' })
  enable2FA(@Param('id') id: number, @Body() payload: TwoFactorAuthDto)
  {
    return this.usersService.enable2FA(+id, payload);
  }

  @Post('users/:id/two-factor-auth/disable')
  @HttpCode(200)
  @UseGuards(AuthGuardJWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable two factor authentication' })
  @ApiResponse({ status: 200, description: 'Two factor authentication disabled successfully' })
  @ApiResponse({ status: 401, description: 'Token not provided or unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  disable2FA(@Param('id') id: number)
  {
    return this.usersService.disable2FA(+id);
  }
}
