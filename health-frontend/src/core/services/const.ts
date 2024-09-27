import { Config } from "../constants/configs";

const CONST = {
  REQUEST: {
    API_ADDRESS: Config.API_SERVER,
    REQUEST_TIMEOUT: 30000,
  },
  STORAGE: {
    ACCESS_TOKEN: "ACCESS_TOKEN",
    REFRESH_TOKEN: "REFRESH_TOKEN",
    USER: "USER",
  },
  REMAINING_TIME: 120, // in seconds, keep it here if it's being used elsewhere in the project
};

export default CONST;
