import { createClient } from "redis";

export const client = createClient({
  //redis[s]://[[username][:password]@][host][:port][/db-number]
  url: "redis://127.0.0.1:6379",
});
