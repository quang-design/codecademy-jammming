<!-- Code callback

https://codecademy-jammming-cyan.vercel.app/api/spotify/callback?code=AQClpNGIHIxtAObEhEOClybykCL0YA-ZzxozhqvCTqKQM5Zi-X-nrOlHxiMERdYWyUOkOX_6ZIU4yKdqKSdMBgBKleJyPVxqMvyEH8L3r7YbrNUabFRTRPKA5AFcIFhlcgSNQbUv3hq9K23pNRKVxJbnU8tWXPI5ubol39-pTS8xHyxVB_xIxnofnxXNBu5XQVvzaI7Myv6NTRy8QGaimEIg1bwHA4s0gEVaK_WrBDLPfw8Z6MkX2AZ4bRE0Atna5V-GjSpDZxaVg6iBLjG8YmOR14U-20k3zyXoAQpcLPgCsr6CDvRLr8RiCXuiSARsm3heWNWDDxxPpBxO -->

[x] save user playlist to localstorage -> reload still shown user playlist

[ ] refactor save playlist to user's spotify account

- [ ] getCurrentUserProfile(code: string) => { id as user_id }
- [ ] createPlaylist(name: string, desc?: string, user_id: string, public: boolean) => { id as playlist_id }
- [ ] formatTrackIds(trackIds: string[]) => string[] ["spotify:track:id_1", "spotify:track:id_2", ...]
- [ ] addItemsToPlaylist(playlist_id: string, track_ids: string[]) => void
