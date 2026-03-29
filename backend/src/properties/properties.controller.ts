import { Controller, Get } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('properties')
// @UseGuards(JwtAuthGuard)
export class PropertiesController {
    constructor(private readonly propertiesService: PropertiesService) {}

    @Get()
    async findAll() {
        const data = await this.propertiesService.findAll();
        return { data };
    }
}
