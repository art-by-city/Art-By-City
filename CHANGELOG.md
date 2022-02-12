# Changelog

## [2022-02-11](#2022-02-11)

### Features
- Add Twitter Username to your Profile
- Added more `<meta>` tags specific to Twitter to help sharing of artwork
  - Artwork shared on Twitter will credit the tweet with the artist's Twitter
    Username
- Generating more efficient thumbnails of artwork when shared via social media

### Bug Fixes
- Discover feed fix when loading more artwork

## [2022-02-02](#2022-02-02)

### Features
- Generate an Arweave wallet directly on https://artby.city/create
- Open Graph Protocol `<meta>` tags enable linking of artwork and artist
  profiles on social media
- Moved some queries to client-side for quicker page loads

### Bug Fixes
- Auth and wallet browser extension sync fix
- Avatar bug fixes


## [2022-01-18](#2022-01-18)

### Features
- Artist Profile info can now be published
  - Add a Display Name that replaces Arweave address
  - Add an Artist Bio
- Avatars
  - Default avatars generated uniquely from wallet address
- Implemented lazy loading of feed for quicker page loads

### Bug Fixes
- Various bug fixes for Avatars, feeds, and profiles


## [2021-07-12](#2021-07-12)

### Features
- Artworks now require and can be retrieved by a valid url slug
- New routing scheme: artworks now live under a user in the url (e.g. `artby.city/artist/artwork-title`)
- Added dedicated `/upload` page

### Bug Fixes
- Hashtags matching bugfix

## [2021-05-22](#2021-05-22)

### Features
- Renamed Account page to Settings
- Artwork description can be blank

### Bug Fixes
- Fixed various site-wide mobile responsiveness issues
- Fixed changelog notification icon issues

## [2021-01-29](#2021-01-29)

### Features
- Added Changelog

### Bug Fixes
- Fixed authentication issues
- Fixed Artwork Zoom Modal issues
- Fixed clicking on LikeButton if ArtworkCard is in the background
- Fixed user's personal portfolio to always have all artwork shown regardless of publication or approval status
- Fixed artwork preview issues during creation/update
- Fixed hashtag form input styling
