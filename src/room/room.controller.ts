import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { updatePremissionDto } from './dto/UpdatePremissionDto';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiBody({
    description: 'Return Token',
    type: CreateRoomDto,
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Post('/update-premission')
  updateHandRaise(@Body() updatePremissionDto: updatePremissionDto) {
    return this.roomService.UpdateHandRaise(updatePremissionDto);
  }
}
