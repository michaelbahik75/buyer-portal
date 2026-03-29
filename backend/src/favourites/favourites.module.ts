import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { Property } from 'src/entities/Entity/Property.entity';
import { Favourite } from 'src/entities/Entity/Favourite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite, Property])],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}