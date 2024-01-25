
## Environment Variables Documentations

### APP_URL
##### the APP_URL object contains the following properties

### APP_KEY
#### Base 64-encoded secret key used for decrypting jwt token, replace it with the actual secret key required for decrypting JWT tokens in your application
```http
  Example : gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a
```

### PARENT_URL
#### The Base URL for the Application
```http
  Example : localhost:9090
```

### LIST_USER
#### Endpoint for retrieving list of users online
| Tyoe | value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `HTTP Method`      | `GET` |   - |
| `Example Endpoint`| `/chat/v1/list-users` | - |

#### Sample Header
```http
  {
  "Authorization" : "Bearer gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a
  }
```
#### Sample Response
```http
[
  {
    room: "6a16f1e3-e25e-45b1-bd95-65ea1f55005d",
    userDetail: {
      id: "6569b441eed2cbcd2dcbfa79",
      name: "Irfan",
      image: "http://192.168.3.19:9090null"
    },
    conversation: { message: "tes", createdAt: "2024-01-18T07:40:44.976Z" }
  }
]
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `room`      | `string` | - |
|`userDetail`|`object`|-|
|`id`|`string`|-|
|`name`|`string`|-|
|`image`|`string`|-|
|`conversation`|`object`|-|
|`message`|`string`|-|
|`createdAt`|`Date`|-|



### HISTORY
#### Endpoint for retrieving chat history
| Type | value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `HTTP Method`      | `GET` |   - |
| `Example Endpoint`| `/chat/v1/history?roomId={roomId}` | - |

#### Sample Header
```http
  {
  "Authorization" : "Bearer gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a
  }
  ```
#### Sample Data Query
```http
  {
    roomId: "ced3f87b-1826-40fe-9225-c84cb85d6387"
  }
```
| Type | value     | Mandatory                       |
| :-------- | :------- | :-------------------------------- |
| `roomId`      | `string` |   `mandatory` |

#### Sample Response
```http
[
  {
    id: "659f6a833f8671b1ba652c6e",
    type: "TEXT",
    sender: { id: "6569b441eed2cbcd2dcbfa79", fullName: "Irfan" },
    content: { text: "test", alt: "", ext: "", url: "" },
    readBy: [ "6569b441eed2cbcd2dcbfa79", "65a8c190dcb83495bd3773fb" ],
    receipent: null,
    createdAt: "2024-01-11T03:28:21.846Z"
  }
]
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `room`      | `string` | - |
|`id`|`string`|-|
|`type`|`string`|-|
|`sender`|`object`|-|
|`id`|`string`|-|
|`fullName`|`string`|-|
|`content`|`object`|-|
|`text`|`string`|-|
|`alt`|`string`|-|
|`ext`|`string`|-|
|`url`|`string`|-|
|`readBy`|`array`|-|
|`receipent`|`string`|-|
|`createdAt`|`Date`|-|


### BACKUP
#### Endpoint for backing up new message to database
| Tyoe | value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `HTTP Method`      | `POST` |   - |
| `Example Endpoint`| `/chat/v1/backup/{room}` | - |

#### Sample Header
```http
  {
  "Authorization" : "Bearer gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a
  }
```

#### Sample Body
```http
[
  {
    type: "TEXT",
    sender: { id: "65a8c190dcb83495bd3773fb", fullName: "Nyobain" },
    content: { text: "tet", url: null, alt: null, ext: null },
    readBy: [ "65a8c190dcb83495bd3773fb" ],
    receipent: null,
    createdAt: "2024-01-18T10:04:33.404Z"
  }
]
```
#### Sample Params
```http
  {
  "room" : "6a16f1e3-e25e-45b1-bd95-65ea1f55005d"
  }
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `room`      | `string` | `send this parameter to store chat to database by room id`  |
| `type`      | `string` | - |
|`sender`|`object`|-|
|`id`|`string`|-|
|`fullName`|`object`|-|
|`content`|`object`|-|
|`text`|`string`|-|
|`alt`|`string`|-|
|`ext`|`string`|-|
|`url`|`string`|-|
|`readBy`|`array`|-|
|`receipent`|`string`|-|
|`createdAt`|`Date`|-|

### READ_MSG
#### Endpoint for updating read message from user to database
| Tyoe | value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `HTTP Method`      | `GET` |   - |
| `Example Endpoint`| `/chat/v1/message/{room}` | - |

#### Sample Header
```http
  {
  "Authorization" : "Bearer gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a"
  }
```
#### Sample Params
```http
  {
  "room" : "6a16f1e3-e25e-45b1-bd95-65ea1f55005d"
  }
```
#### Sample Body
```http
{
    "conversations" : ['65a8d5fe3d5bfb374b41f04a','65a8d4a13d5bfb374b41f025','65a8d2023d5bfb374b41f006',],
    "user" : "65a8d4a13d5bfb374b41f025"
  }
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `room`      | `string` | `send this parameter to store chat to database by room id` |
|`conversations`|`array`|`send this parameter to update the chat by conversations id`|
|`user`|`string`|`user id to update the chat readBy`|

### AUTH_USER
#### Endpoint for authenticating user
| Type | value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `HTTP Method`      | `GET` |   - |
| `Example Endpoint`| `/chat/v1/user/` | - |

#### Sample Header
```http
  {
  "Authorization" : "Bearer gp9HjjEj813Y9JGoqwOeOPWbnt4CUpvIJbU1mMU4a11MNDZ7Sg5u9a"
  }
```


#### Sample Response
```http
  {
  "status" : "true",
  "message" "http.success"
  "result" : true
  }
```

