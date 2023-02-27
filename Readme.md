# Eksi Sozluk API

Quick and Dirty (maybe) work-in-progress api.

![App Code Quality](https://img.shields.io/static/v1?label=Status&message=Shitty&color=red "Title")


# Endpoints 
- `/v1/today` Returns today's topic list.
- `/v1/thread/{thread title}` Returns a thread.
- `/v1/user/{username}` Returns information about a user.


# Samples
These 2 returns same results.

`/v1/thread/20 şubat 2023 hatay depremi yardım ağı`
`/v1/thread/20-subat-2023-hatay-depremi-yardim-agi--7598878`

To see the next page, check `pages` object.
