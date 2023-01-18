import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    RoomModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'RedisSERVICE',
      useFactory: (configService: ConfigService) => {
        const options = configService.get('redishost', 'redisport');
        return ClientProxyFactory.create(options);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}

// (configService:ConfigService) => {
//   (return[
//     {
//       name: 'RedisSERVICE',
//       transport: Transport.REDIS,
//       options: {
//         host: configService.get<string>('')m
//         port: configService.get<string>(''),
//       },
//     },
//   ]),
// }
