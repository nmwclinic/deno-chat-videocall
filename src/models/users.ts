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
