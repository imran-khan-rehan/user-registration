// src/common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // Hardcoded token configuration
  private readonly HARDCODED_TOKEN = process.env.HARDCODED_TOKEN;
  private readonly USE_HARDCODED_TOKEN = process.env.USE_HARDCODED_TOKEN === 'true' || !process.env.JWT_SECRET;

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }

    // Hardcoded token check (for testing purposes)
    if (this.USE_HARDCODED_TOKEN) {
      if (token === this.HARDCODED_TOKEN) {
        // Mock user for hardcoded token
        request['user'] = { 
          id: 'test-user', 
          email: 'test@example.com',
          type: 'hardcoded' 
        };
        return true;
      }
      // If using hardcoded token mode but token doesn't match, reject
      throw new UnauthorizedException('Invalid hardcoded token');
    }
    
    // Regular JWT validation
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      // Assign the payload to the request object
      request['user'] = { ...payload, type: 'jwt' };
    } catch {
      throw new UnauthorizedException('Invalid JWT token');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}