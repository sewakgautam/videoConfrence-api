import * as Redis from 'redis';
const redisClient = Redis.createClient();

redisClient.connect();
redisClient.on('ready', () => {
  console.log('Redis client is ready');
});

export async function redisCacheSet(userandroom: string, token, ttl) {
  console.log(token);
  const datasaved = await redisClient.set(
    userandroom,
    JSON.stringify(token),
    ttl,
  );
  return datasaved;
}

export async function redisChaceGet(userandroom) {
  const token = await redisClient.get(userandroom);
  return token;
}
