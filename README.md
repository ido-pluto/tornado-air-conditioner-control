# Aux Air-Conditioner-Control

Simple AUX air conditioner control system.
Connect to Tornado 3 wifi network and send commands to the air conditioner.

**This is for educational purposes only, I'm not responsible for any damage caused by this software.**

## Usage

First, download the Tornado 3 wifi app and config the air conditioner with your account.

Then capture a power on/off command via http request, the URL should be like this:

```
/device/control/v2/sdkcontrol?license=
```

You should capter the Raw HTTP request and save it to `request.http` file.

https://stackoverflow.com/a/17685506/14849730

Then, you can send the command to the air conditioner via the SDK, checkout `src/plans/` for examples.


## Installation

```bash
bun install git+https://github.com/ido-pluto/tornado-air-conditioner-control.git
```