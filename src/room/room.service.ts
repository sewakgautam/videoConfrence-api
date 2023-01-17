import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class RoomService {
  create(input: CreateRoomDto) {
    if (!input.roomid || !input.userid)
      throw new BadRequestException('Please pass required data');
    const roomName = input.roomid;
    const participantName = input.userid;

    const apiKey = 'devkey';
    const secretKey = 'secret';

    const at = new AccessToken(apiKey, secretKey, {
      identity: participantName,
    });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = at.toJwt();
    return { token };
  }
}
