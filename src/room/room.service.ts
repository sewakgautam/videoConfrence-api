import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { redisCacheSet, redisChaceGet } from 'src/redishelper';
import { ConfigService } from '@nestjs/config';
import { Room } from './entity/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandRaiseDto } from './dto/HandRaise.dto';
import { identity } from 'rxjs';
import { canPublishPremissionDto } from './dto/Canpublish.dto';

@Injectable()
export class RoomService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  async create(input: CreateRoomDto) {
    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const metadata = JSON.stringify({ raised: [] });
    const ttl = await this.configService.get('ttl');

    if (!input.user || !input.room)
      throw new BadRequestException('Please pass required data');
    const roomdetails = await this.roomRepository.find({
      where: { room: input.room },
    });
    const checking = roomdetails.map((eachData) => {
      if (eachData.user === input.user || eachData.user === 'supervisor') {
        throw new BadRequestException('This user Already Exist on room');
      }
    });

    const participantName = input.user;
    console.log(input.user);

    const at = new AccessToken(apiKey, secretKey, {
      identity: participantName,
      ttl,
      metadata,
    });
    at.addGrant({
      roomJoin: true,
      canPublish: input.user == 'superuser',
      canSubscribe: true,
    });
    const token = at.toJwt();
    const saveUser = await this.roomRepository.save(input);
    return { ...saveUser, token };
  }

  async UpdateHandRaise(input: HandRaiseDto) {
    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const host = await this.configService.get('host');

    const { roomId, userId } = input;
    const metadata = JSON.stringify({ raised: [`${userId}`] });

    const at = new RoomServiceClient(host, apiKey, secretKey);
    at.updateRoomMetadata(roomId, metadata);
    return { message: `${userId} has Raise the Hand` };
  }

  async canPublishPremission(input: canPublishPremissionDto) {
    const { roomId, identity, userId } = input;
    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const host = await this.configService.get('host');
    const at = new RoomServiceClient(host, apiKey, secretKey);
    at.updateParticipant(roomId, identity, undefined, {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      hidden: false,
      recorder: false,
    });

    return { message: `${userId} got premission to canPublish` };
  }
}
