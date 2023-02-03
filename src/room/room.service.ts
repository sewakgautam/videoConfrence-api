import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { AccessToken } from 'livekit-server-sdk';
import { redisCacheSet, redisChaceGet } from 'src/redishelper';
import { ConfigService } from '@nestjs/config';
import { Room } from './entity/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  async create(input: CreateRoomDto) {
    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
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

  update(sid: string) {
    return true;
  }
}
