import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// User Profile Operations
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export const updateUserProfile = async (userId: string, userData: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// Investment Operations
export const addInvestment = async (userId: string, investmentData: any) => {
  try {
    const investmentRef = doc(collection(db, 'users', userId, 'investments'))
    await setDoc(investmentRef, {
      ...investmentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return investmentRef.id
  } catch (error) {
    console.error('Error adding investment:', error)
    throw error
  }
}

export const getUserInvestments = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'investments'),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting user investments:', error)
    throw error
  }
}

export const removeInvestment = async (userId: string, investmentId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'investments', investmentId))
  } catch (error) {
    console.error('Error removing investment:', error)
    throw error
  }
}

// Portfolio Operations
export const updatePortfolio = async (userId: string, portfolioData: any) => {
  try {
    const portfolioRef = doc(db, 'users', userId, 'portfolio', 'current')
    await setDoc(portfolioRef, {
      ...portfolioData,
      updatedAt: Timestamp.now()
    }, { merge: true })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    throw error
  }
}

export const getPortfolio = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId, 'portfolio', 'current')
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error('Error getting portfolio:', error)
    throw error
  }
}

// Price Alert Operations
export const addPriceAlert = async (userId: string, alertData: any) => {
  try {
    const alertRef = doc(collection(db, 'users', userId, 'alerts'))
    await setDoc(alertRef, {
      ...alertData,
      createdAt: Timestamp.now(),
      isActive: true
    })
    return alertRef.id
  } catch (error) {
    console.error('Error adding price alert:', error)
    throw error
  }
}

export const getUserAlerts = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'alerts'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting user alerts:', error)
    throw error
  }
}

// Gold Price Operations (read-only for users)
export const getGoldPrices = async () => {
  try {
    const q = query(
      collection(db, 'goldPrices'),
      orderBy('timestamp', 'desc'),
      limit(50)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting gold prices:', error)
    throw error
  }
}

// Platform Data Operations (read-only for users)
export const getPlatforms = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'platforms'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting platforms:', error)
    throw error
  }
}