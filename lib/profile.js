/**
 * @typedef {{ id: string, name: string, account: string, profile_image_urls: Record<string, string> }} PixivAccount
 */

/**
 * Parse profile.
 *
 * @param {{ response: PixivAccount[] }} json
 * @return {import('passport').Profile}
 * @api private
 */
exports.parse = ({ response }) => {
  const [account] = response;

  return {
    provider: "pixiv",
    id: String(account.id),
    displayName: account.name,
    username: account.account,
    photos: Object.values(account.profile_image_urls).map((url) => ({
      value: url,
    })),
  };
};
