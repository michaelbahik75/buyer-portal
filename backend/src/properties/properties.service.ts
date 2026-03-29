import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from 'src/entities/Entity/Property.entity';

@Injectable()
export class PropertiesService implements OnModuleInit {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  // Seed some sample properties on startup if table is empty
  async onModuleInit() {
    const count = await this.propertyRepository.count();
    if (count === 0) {
      await this.propertyRepository.save([
        { name: 'Sunset Apartments', location: 'Thamel, Kathmandu', price: 'NPR 45,000/mo', type: 'rent' },
        { name: 'Green Villa', location: 'Patan, Lalitpur', price: 'NPR 1.2 Cr', type: 'sale' },
        { name: 'City Studio', location: 'New Baneshwor', price: 'NPR 22,000/mo', type: 'rent' },
        { name: 'Hilltop Cottage', location: 'Nagarkot', price: 'NPR 85 Lakh', type: 'sale' },
        { name: 'Garden Flat', location: 'Bhaktapur', price: 'NPR 30,000/mo', type: 'rent' },
        { name: 'Valley View', location: 'Godawari', price: 'NPR 2.5 Cr', type: 'sale' },
      ]);
    }
  }

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find({ order: { createdAt: 'DESC' } });
  }
}