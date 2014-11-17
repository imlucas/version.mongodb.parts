# [version.mongodb.parts](http://version.mongodb.parts)

[![wercker status](https://app.wercker.com/status/c7297af82fce3c30fce03d4c674acc32/m "wercker status")](https://app.wercker.com/project/bykey/c7297af82fce3c30fce03d4c674acc32)

Download MongoDB binaries and look up version information.

## Examples

### Links

Easy to share, the `/download/{version}` will just resolve and redirect to the
request straight to the tarball (or zip for windows).

> Where can I download the latest stable version of MongoDB for OSX?

http://version.mongodb.parts/download/stable?platform=osx

> Do you know where I might be able to download the 2.8 rc0 for windows 64-bit?

http://version.mongodb.parts/download/unstable?platform=win32&bits=64

> What about commit [3898bb](3898bb) on the v2.6 branch for fedora8?

http://version.mongodb.parts/download/3898bb1e160e1118a84114620bec62e63254ed77?branch=v2.6&buildvariant=fedora8

### Scripting

You can also hit the [REST API](#api), which is quite handy for scripting
a download on Windows:

#### Powershell

```powershell
$body = @{
  platform = "win32"
  bits = "32"
}
if ([Environment]::Is64BitProcess) {
    $body.bits = "64"
}

$headers = @{
  Accept = "application/json"
}

$url = "http://versions.mongodb.parts/api/v1/latest"
$res = (Invoke-RestMethod $url -Headers $headers -Body $params)

$webclient = New-Object System.Net.WebClient
$webclient.DownloadFile($res.url, "$pwd\$res.filename")
```
#### Python

```python
import requests
import platform
import json

# versions.mongodb.parts will handle normalizing these for us e.g.:
# - platform: `Windows` -> `win32`
# - bits: `64bit` -> `64`
params = {
  'bits': platform.architecture()[0]
  'platform': platform.system()
}
url = 'http://version.mongodb.parts/api/v1/stable'
req = requests.get(url, headers={'Accept': 'application/json'})
req.raise_for_status()
metadata = req.json()

# Where to put the zip or tarball
save_as = './{}'.format(metadata.filename)

# Download it
download = requests.get(metadata.url, stream=True)
with open(save_as, 'wb') as f:
    # Raise an exception if we get a 404 instead of silently
    # writing a 238 byte xml file that will just raise a cryptic
    # error when we try to decompress it
    download.raise_for_status()
    for chunk in r.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)
            f.flush()
```

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
    Content-Length: 62
    Content-Type: text/plain; charset=utf-8
    Date: Mon, 17 Nov 2014 15:30:58 GMT
    ETag: W/"3a-631db0b6"
    Vary: Accept
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
