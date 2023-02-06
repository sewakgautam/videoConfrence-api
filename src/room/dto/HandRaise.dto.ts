import { ApiProperty } from '@nestjs/swagger';

export class HandRaiseDto {
  @ApiProperty({ type: 'string', example: 'nepal' })
  roomId: string;
  @ApiProperty({ type: 'string', example: 'Sewak' })
  userId: string;
}
