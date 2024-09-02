import { createClient } from "redis";
import { promisify } from "util";

class RedisClient{
    constructor(){
        this.redisClient = createClient();
        this.redisClientIsConnected = true;

        this.redisClient.on("error", (err) => {
            this.redisClientIsConnected = false;
            console.log("Failed to connect to redis client..",err.message);
        });

        this.redisClient.on('connect', () => {
            this.redisClientIsConnected = true;
            console.log("redisClient is connected");
        });
    }

    isAlive(){
        return this.redisClientIsConnected;
    }
    async get(key){
        return promisify(this.redisClient.GET).bind(this.redisClient)(key)
    }

    async set(key, value, duration){
        return promisify(this.redisClient.SETEX).bind(this.redisClient)(key, value, duration);
    }

    async del(key){
        promisify(this.redisClient.DEL).bind(this.redisClient)(key);
    }

}

export const redisNewClient = new RedisClient();
export default redisNewClient;
