import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'POA Tracker Backend',
      version: '1.0.0',
    };
  }
}
