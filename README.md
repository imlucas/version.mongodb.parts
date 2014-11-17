# [version.mongodb.parts](http://version.mongodb.parts)

[![wercker status](https://app.wercker.com/status/c7297af82fce3c30fce03d4c674acc32/m "wercker status")](https://app.wercker.com/project/bykey/c7297af82fce3c30fce03d4c674acc32)

Download MongoDB binaries and look up version information.

## Examples

> Where can I download the latest stable version of MongoDB for OSX?

http://version.mongodb.parts/download/stable?platform=osx

> Do you know where I might be able to download the 2.8 rc0 for ubuntu 64-bit?

http://version.mongodb.parts/download/unstable?platform=linux&bits=64

> What is the URL to download the latest 2.6 series for windows 64-bit with debugging?

http://version.mongodb.parts/download/2.6.x?platform=win32&bits=64&debug=yes

> What about commit [3898bb](3898bb) on the v2.6 branch for fedora8?

http://version.mongodb.parts/download/3898bb1e160e1118a84114620bec62e63254ed77?branch=v2.6&buildvariant=fedora8

## API

### /api/v1/{version}

#### Parameters
  + version (string) ... Semver-ish versions (e.g. `2.6.5`, `2.4.x`, `2.8.x`), shortcut (e.g. `stable -> lastest even minor version`, `unstable|latest ->latest odd minor version`), or commit sha1 (see distro below)
  + platform (string) ... win32|osx|darwin|linux|solaris
  + bits (string) ... 32|64
  + debug (boolean) ... Include debug symbols
  + distro (string) ... Required if version is a sha1 to map onto mci, ignored if not a sha1
  + branch (string, `master`) ... Branch commit was in because of mci id structure

#### Response 200 (text/plain)

##### Headers

    Connection: keep-alive
    Date: Mon, 17 Nov 2014 15:30:58 GMT
    ETag: W/"3a-631db0b6"
    Vary: Accept
    mongodb-version: 2.6.5
    X-Content-Type-Options: nosniff
    X-Download-Options: noopen
    X-Frame-Options: SAMEORIGIN
    X-XSS-Protection: 1; mode=block

##### Body

    http://fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.5.tgz

## Testing

```
npm test
```

## License

MIT

[d12f37]: https://github.com/mongodb/mongo/commit/3898bb1e160e1118a84114620bec62e63254ed77
