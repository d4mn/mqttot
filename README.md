# `mqtt`

This package contains the foundation for both FBNS and Realtime.
It consists of the following parts:

- **MQTT Client** as the communication base
- **MQTToT** to comply with Facebooks adjustments to MQTT
- **Basic Thrift Handling** for reading and writing packets

MQTToT is the "protocol" used for both FBNS and Realtime in the Android app.
The web uses "raw" mqtt.
This protocol isn't documented anywhere, so parts of the implementation are just guessing the architecture.
However you can "translate" the java code of the android app (more in the [developing](#developing) section).

## Components

### MQTToTClient

This is a wrapper around the MqttClient provided by mqtts. It extends two packets.

1. **The `CONNECT` packet.** It's header is changed and **not compatible** with the MQTT 3 standard.
   This is the reason why mqtts is used in the first place. It allows the overriding of mqtt packets.
   The packet is structured like this:

| Name           | Type                                                                                                | Value            | Comment                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Protocol Name  | [`UTF-8 string`](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718016) | `MQTToT`         |                                                                                                                                        |
| Protocol Level | `byte`                                                                                              | `3`              | Indicating conformance with the [MQTT 3.1 standard](https://public.dhe.ibm.com/software/dw/webservices/ws-mqtt/mqtt-v3r1.html#connect) |
| Flags          | `byte`                                                                                              | `0b1100_0010`    | Corresponding to `username, password and clean session`                                                                                |
| Keep Alive     | `word`/ `u16`                                                                                       | `0..0xffff`      | Keep alive interval in seconds                                                                                                         |
| Payload        | `Buffer`                                                                                            | some binary data | The length of the payload can be determined using the `remaining length` in the packet header.                                         |

2. **The `CONNACK` packet.** This packet is basically the regular `CONNACK` packet with an added optional payload.

| Name              | Type     | Value            | Comment                                                                                                                                       |
| ----------------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Acknowledge Flags | `byte`   | `0` or `1`       | Value `1` indicating a session session was present (only if _clean session_ was false)                                                        |
| Return Code       | `byte`   | `0..5`           | Value `0` is `Accepted`. Other values are documented [here](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Table_3.1_-) |
| Payload           | `Buffer` | some binary data | **optional**, otherwise the same as in the `CONNECT` packet.                                                                                  |

In this implementation there's a `payloadProvider` which is used because the client is made to be _reloadable_, and the payload _might_ change between connect attempts.

The actual extending of the `MqttClient` is done in two important places.

1.  **The constructor**: The default read and write maps are changed to use the new `CONNECT` and `CONNACK` packets.
2.  **The `getConnectFlow` method** is overwritten to return a custom connect flow which uses the new packets and checks the payload on connect success.

Everything else is the same as in regular MQTT.

#### Developing

Most of these discoveries were made by [mgp25 and valga](https://github.com/valga/fbns-react/).
They can be verified by intercepting MQTT Packets. More on this can be read in [android-realtime](/packages/android/src/realtime/README.md).

### Thrift

[Apache Thrift](https://thrift.apache.org/) is actually an entire framework of components. _"Thrift"_ in this context refers to the [`TCompactProtocol`](https://erikvanoosten.github.io/thrift-missing-specification/#_thrift_compact_protocol_encoding) which is used to serialize and deserialize messages.
In contrast to for example JSON or XML, both sender and receiver agree on a message structure.
That's why you can't get names for the fields found in some payload.

This implementation isn't a fully featured implementation of the thrift protocol, it only contains the features needed.
Additionally, it abstracts the serialization and deserialization of JavaScript objects away from the user, so whole objects can be passed/retrieved to/from the functions.
This requires a configuration (the message structure). It's used in both Realtime and FBNS, that's why it's located in this package.

#### Developing

Some names can be found th in Instagram apk, others are from fbns-react.
You can search for known strings in the apk and find classes related to the message.
The code is minified/obfuscated so property names are just arbitrary,
but in some cases the classes contain a `toString` method allowing you to trace the names.
