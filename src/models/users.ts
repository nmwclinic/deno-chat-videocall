interface Email {
  value: string
  verified?: Date
}

interface Phone {
  value: string
  verified?: Date
}

interface BirthLocation {
  location: string
  date: Date
}

interface Address {
  _id: string
  street: string
  phone: string
  recipientName: string
  label: string
  primary: boolean
  postalCode: string
  note: string
  area: {
    provinceId: number
    province: string
    cityId: number
    city: string
    districtId: number
    district: string
    subDistrict: string
  }
}

interface Blood {
  category: 'A' | 'B' | 'AB' | 'O' | null
  rhesus: '+' | '_' | null
}

interface Identification {
  category: 'KTP' | 'SIM' | 'Passport' | 'Visa' | 'Student' | 'Other' | null
  code: string
  birth: BirthLocation
  sex: 1 | 0
  address: Address[]
  religion: 'Muslim' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu' | null
  marital: string
  nationality: string
  blood: Blood
  profession: string
  pathKtp: string
}

interface Delete {
  _user: string // Ganti dengan tipe yang sesuai
  reason: string
  deleted: Date
}

interface UserProps {
  fullName: string
  email: Email
  phone: Phone
  password: string
  image: string
  register: {
    _marketplace: string // Ganti dengan tipe yang sesuai
    _users: string // Ganti dengan tipe yang sesuai
    registered: Date
  }
  subscribe: {
    date: Date
    code: string
    point: number
    reference: string
  }
  identification: Identification
  bankAccount: Array<{
    _bank: string
    rekening: number
    name: string
  }>
  notification: {
    activity: {
      productDiscussion: boolean
    }
    transaction: {
      waitingPayment: boolean
      waitingConfirm: boolean
      processed: boolean
      shipped: boolean
      arrives: boolean
    }
    promotion: {
      newsletter: boolean
      discountVoucher: boolean
      birthDay: boolean
      newProduct: boolean
    }
  }
  session: Array<{
    _id: string
    uuid: string
    token: string
    expired: number
    device: string
  }>
  reset: {
    token: string
    code: string
    expired: Date
  } | null
  _role: string[]
  delete: Delete
}

// const USERS_SCHEMA = new Schema({
//   fullName: { type: String },
//   email: {
//     value: {
//       type: String,
//       trim: true,
//       lowercase: true,
//       index: {
//         unique: true,
//         sparse: true,
//         partialFilterExpression: { 'email.value': { $type: 'string' } }
//       }
//     },
//     verified: { type: Date, default: null }
//   },
//   phone: {
//     value: {
//       type: String,
//       trim: true,
//       min: 8,
//       max: 16,
//       index: {
//         unique: true,
//         sparse: true,
//         partialFilterExpression: { 'phone.value': { $type: 'string' } }
//       },
//       default: null
//     },
//     verified: { type: Date, default: null }
//   },
//   password: { type: String },
//   image: { type: String, default: '/img/profile.png' },
//   register: {
//     _marketplace: { type: Schema.Types.ObjectId, ref: 'Marketplaces' },
//     _users: { type: Schema.Types.ObjectId, ref: 'Users' },
//     registered: Date
//   },
//   subscribe: {
//     date: { type: Date, default: null }, // annual date
//     code: {
//       type: String,
//       trim: true,
//       lowercase: true,
//       index: {
//         unique: true,
//         sparse: true,
//         partialFilterExpression: { 'subscribe.code': { $type: 'string' } }
//       },
//       default: null
//     },
//     point: { type: Number, default: 0 },
//     reference: { type: String, default: null } // Pembelian subscribe
//   },
//   identification: {
//     category: {
//       type: String,
//       enum: ['KTP', 'SIM', 'Passport', 'Visa', 'Student', 'Other', null],
//       default: null
//     },
//     code: { type: String, default: null },
//     birth: {
//       location: { type: String, default: null },
//       date: { type: Date, default: null }
//     },
//     sex: { type: Number, default: null }, // 1 Laki-laki | 0 Wanita
//     address: [
//       {
//         street: { type: String },
//         recipientName: { type: String },
//         phone: { type: String, trim: true, min: 8, max: 16 },
//         label: { type: String }, // Rumah, Apartemen, Kantor, Kos
//         primary: { type: Boolean },
//         note: { type: String },
//         postalCode: { type: String },
//         area: {
//           provinceId: Number,
//           province: String,
//           cityId: Number,
//           city: String,
//           districtId: Number,
//           district: String,
//           subDistrict: String
//         }
//       }
//     ],
//     religion: {
//       type: String,
//       enum: ['Muslim', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', null],
//       default: null
//     },
//     marital: { type: Boolean, default: false },
//     nationality: { type: String, default: 'WNI' },
//     blood: {
//       category: {
//         type: String,
//         enum: ['A', 'B', 'AB', 'O', null],
//         default: null
//       },
//       rhesus: {
//         type: String,
//         enum: ['+', '_', null],
//         default: null
//       }
//     },
//     profession: { type: String, default: null },
//     pathKtp: { type: String, default: null }
//   },
//   bankAccount: [
//     {
//       _bank: { type: Schema.Types.ObjectId, ref: 'Banks' },
//       rekening: { type: Number },
//       name: { type: String }
//     }
//   ],
//   notification: {
//     activity: {
//       productDiscussion: { type: Boolean, default: true }
//     },
//     transaction: {
//       waitingPayment: { type: Boolean, default: true },
//       waitingConfirm: { type: Boolean, default: true },
//       processed: { type: Boolean, default: true },
//       shipped: { type: Boolean, default: true },
//       arrives: { type: Boolean, default: true }
//     },
//     promotion: {
//       newsletter: { type: Boolean, default: true },
//       discountVoucher: { type: Boolean, default: true },
//       birthDay: { type: Boolean, default: true },
//       newProduct: { type: Boolean, default: true }
//     }
//   },
//   session: [
//     {
//       uuid: { type: String },
//       token: { type: String },
//       expired: { type: Number },
//       device: { type: String }
//     }
//   ],
//   reset: {
//     token: { type: String },
//     code: { type: Number },
//     expired: { type: Date }
//   },
//   _role: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
//   delete: {
//     type: {
//       _user: { type: Schema.Types.ObjectId, ref: 'Users' },
//       reason: { type: String },
//       deleted: { type: Date }
//     },
//     required: false
//   }
// }, {
//   timestamps: true
// })

// interface UserDocument extends Document, UserProps { }
// const USERS_MODEL = model<UserDocument>('Users', USERS_SCHEMA)

// export default USERS_MODEL
// export type { UserDocument }
