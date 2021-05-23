// import firebase from 'firebase/app'
// import 'firebase/firestore'

// // Get a Firestore instance
// export const db = firebase
//   .initializeApp({ projectId: 'chrstest-927f2' })
//   .firestore()

// // Export types that exists in Firestore
// // This is not always necessary, but it's used in other examples
// const { Timestamp, GeoPoint } = firebase.firestore
// export { Timestamp, GeoPoint }

// // if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })

// Get a RTDB instance
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

export const db = firebase
  .initializeApp({ databaseURL: 'https://chrstest-927f2-default-rtdb.firebaseio.com', storageBucket: "chrstest-927f2.appspot.com", apiKey: "AIzaSyDuk_kmqwZeyX_yCoBsxljyu6sHdVErops" })
  .database()