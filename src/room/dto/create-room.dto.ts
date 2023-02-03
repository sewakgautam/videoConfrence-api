import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  user: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  room: string;
}
