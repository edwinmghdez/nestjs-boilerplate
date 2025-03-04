import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

/** The HealthController class checks the health of various components including the database, memory,
 and disk. */
@ApiTags('Health')
@Controller({
  version: '1'
})
export class HealthController
{
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  /**
   * The function checks the health of various components including the database, memory, and storage.
   * @returns The `check()` function is returning the result of calling the `health.check()` method
   * with an array of functions as arguments. Each function in the array is a check for a different
   * aspect of the system's health, including the status of the database, memory usage, and disk
   * storage. The `health.check()` method will return a Promise that resolves with an array of objects
   * representing the results of each check
   */
  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Check the health status of the application' })
  async check()
  {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 300 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.disk.checkStorage('storage', { thresholdPercent: 0.8, path: '/' }),
    ]);
  }
}