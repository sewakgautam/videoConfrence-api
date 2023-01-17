import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  roomid: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  userid: string;
}
