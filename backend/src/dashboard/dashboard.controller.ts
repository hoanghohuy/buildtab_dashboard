import { Controller, Get } from '@nestjs/common';
import * as overview from './mocks/overview.json';
import * as orgChart from './mocks/org-chart.json';
import * as finance from './mocks/finance.json';
import * as contractorHealth from './mocks/contractor-health.json';

@Controller('dashboard')
export class DashboardController {
  @Get('overview')
  getOverview() {
    return overview;
  }

  @Get('org-chart')
  getOrgChart() {
    return orgChart;
  }

  @Get('finance')
  getFinance() {
    return finance;
  }

  @Get('contractor-health')
  getContractorHealth() {
    return contractorHealth;
  }
}
