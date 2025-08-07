import {createClient} from "redis"

const redis = createClient()

redis.on("error", (error) => {
    console.log("Redis connection error", error);
})

export {redis}