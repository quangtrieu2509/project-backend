import * as admin from 'firebase-admin'
import { getStorage } from 'firebase-admin/storage'
import serviceAccount from './trippie-adminsdk.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'gs://trippie-61780.appspot.com'
})
const bucket = getStorage().bucket()

export { bucket }
