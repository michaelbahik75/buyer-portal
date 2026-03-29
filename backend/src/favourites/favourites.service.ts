import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourite } from 'src/entities/Entity/Favourite.entity';
import { Property } from 'src/entities/Entity/Property.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourite)
    private favouriteRepository: Repository<Favourite>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  // GET /favourites — only returns logged-in user's favourites
  async getMyFavourites(userId: number) {
    const favourites = await this.favouriteRepository.find({
      where: { user: { id: userId } },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
    return favourites.map((f) => ({ favouriteId: f.id, ...f.property }));
  }

  // POST /favourites/:propertyId — add to favourites
  async addFavourite(userId: number, propertyId: number) {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Check if already favourited
    const existing = await this.favouriteRepository.findOne({
      where: { user: { id: userId }, property: { id: propertyId } },
    });
    if (existing) {
      throw new ConflictException('Property already in favourites');
    }

    const favourite = this.favouriteRepository.create({
      user: { id: userId } as any,
      property,
    });

    await this.favouriteRepository.save(favourite);
    return { message: 'Added to favourites', data: { ...property } };
  }

  // DELETE /favourites/:propertyId — remove from favourites
  async removeFavourite(userId: number, propertyId: number) {
    const favourite = await this.favouriteRepository.findOne({
      where: { user: { id: userId }, property: { id: propertyId } },
    });

    if (!favourite) {
      throw new NotFoundException('Favourite not found');
    }

    // Enforce ownership — users can only remove their own favourites
    await this.favouriteRepository.remove(favourite);
    return { message: 'Removed from favourites' };
  }
}