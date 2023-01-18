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
      .then(async (res) => {
        if (!res) {
          const roomName = input.roomid;
          const participantName = input.userid;

          const apiKey = await this.configService.get('apikey');
          const secretKey = await this.configService.get('secretkey');
          const ttl = await this.configService.get('ttl');

          const at = new AccessToken(apiKey, secretKey, {
            identity: participantName,
            ttl,
          });
          at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
          });

          const token = at.toJwt();
          redisCacheSet(`${input.userid}-${input.roomid}`, token);
          return token;
        }
        const replacetoken = res.replace(/"/g, '');
        return replacetoken;
      })
      .catch((err) => {
        console.log(err);
      });

    return { tokens };
  }
}
