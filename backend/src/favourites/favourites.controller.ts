import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@Controller('favourites')
@UseGuards(JwtAuthGuard) // all routes require a valid JWT
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  // GET /favourites — get logged-in user's favourites only
  @Get()
  getMyFavourites(@Request() req: any) {
    return this.favouritesService.getMyFavourites(req.user.id);
  }

  // POST /favourites/:propertyId — add property to favourites
  @Post(':propertyId')
  addFavourite(
    @Request() req: any,
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ) {
    return this.favouritesService.addFavourite(req.user.id, propertyId);
  }

  // DELETE /favourites/:propertyId — remove property from favourites
  @Delete(':propertyId')
  removeFavourite(
    @Request() req: any,
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ) {
    return this.favouritesService.removeFavourite(req.user.id, propertyId);
  }
}