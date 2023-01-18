import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { AccessToken } from 'livekit-server-sdk';
import { redisCacheSet, redisChaceGet } from 'src/redishelper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomService {
  constructor(private configService: ConfigService) {}

  async create(input: CreateRoomDto) {
    if (!input.roomid || !input.userid)
      throw new BadRequestException('Please pass required data');
    const tokens = await redisChaceGet(`${input.userid}-${input.roomid}`)
      .then((res) => {
        if (!res) {
          const roomName = input.roomid;
          const participantName = input.userid;

          const apiKey = this.configService.get('apikey');
          const secretKey = this.configService.get('secretkry');

          const at = new AccessToken('devkey', 'secret', {
            identity: participantName,
          });
          at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
          });

          const token = at.toJwt();
          redisCacheSet(
            `${input.userid}-${input.roomid}`,
            token,
            this.configService.get('ttl'),
          );
          return token;
        }
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    return { tokens };
  }
}
