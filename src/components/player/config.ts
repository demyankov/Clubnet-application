import { TextButtonConfigType } from 'components/player/types';
import { FriendStatus } from 'constants/friendStatus';

export const BUTTON_TEXT_CONFIG: TextButtonConfigType = {
  [FriendStatus.friend]: 'removeFriend',
  [FriendStatus.request]: 'friendRequest',
  [FriendStatus.sent]: 'friendRequest',
  [FriendStatus.unknown]: 'addFriend',
};
