import {createClient} from "redis"

const redis = createClient({
    socket: {
        host: "my-redis",
        port: 6379
    }
});

redis.on("error", (error) => {
    console.log("Redis connection error", error);
})

export {redis}