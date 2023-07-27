import { FriendStatus } from 'constants/friendStatus';

export type TextButtonConfigType = Record<
  FriendStatus.friend | FriendStatus.request | FriendStatus.sent | FriendStatus.unknown,
  string
>;
