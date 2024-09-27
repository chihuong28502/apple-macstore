import MSTFetch from "./fetch";

const AuthReQuestURL = {
  refreshToken: "",
};

export const AuthRequest = {
  refreshToken: ({
    currentRefreshToken,
  }: {
    currentRefreshToken?: string | null;
  }) => {
    return MSTFetch.post(AuthReQuestURL.refreshToken, {
      refreshToken: currentRefreshToken,
    });
  },
};
