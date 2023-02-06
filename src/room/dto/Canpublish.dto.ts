import { ApiProperty } from '@nestjs/swagger';

export class canPublishPremissionDto {
  @ApiProperty({ type: 'string', example: 'nepal' })
  roomId: string;
  @ApiProperty({ type: 'string', example: 'nepal' })
  identity: string;
  @ApiProperty({ type: 'string', example: 'Sewak' })
  userId: string;
}
