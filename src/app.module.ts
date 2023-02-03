import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB } from 'config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      type: 'postgres',
      synchronize: true,
      host: DB.host,
      database: DB.database,
      username: DB.username,
      password: DB.password,
      port: +DB.port,
    }),
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
