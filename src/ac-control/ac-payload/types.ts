export enum AcMode {
    Cool = 0,
    Heat = 1,
    Dry = 2,
    Fan = 3,
    Auto = 4
}

export enum AcPower {
    Off = 0,
    On = 1
}

export enum AcValues {
    Power = "pwr",
    Display = "scrdisp",
    SleepMode = "sleepdiy",
    Mode = "ac_mode",
    FanSpeed = "ac_mark",
    ComfWind = "comfwind",
    LeftRightSwing = "ac_hdir",
    UpDownSwing = "ac_vdir",
    EcoMode = "ecomode",
    Clean = "ac_clean",
    Temperature = "temp",
    TemperatureUnit = "tempunit",
    TemperatureDecimal = "ac_tempdec",
    TemperatureConvert = "ac_tempconvert",
    EnvironmentTemperature = "envtemp"
}

export enum FanSpeed {
    Auto = 0,
    Low = 1,
    Medium = 2,
    High = 3,
    Turbo = 4
}