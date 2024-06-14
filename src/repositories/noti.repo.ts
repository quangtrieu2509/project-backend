import { uid } from 'uid'
import { Noti, Trip, User } from '../models'
import type { INoti, ITrip, IUser } from '../types'
import { omitIsNil } from '../utils'
import { notiTypes } from '../constants'
import { sendNoti } from '../routers/socket.route'

export const createNoti = async (noti: INoti): Promise<INoti> => {
  const newNoti = await Noti.create(noti)
  return await newNoti.toObject()
}

export const createTripInteractNoti = async (userId: string, tripId: string): Promise<void> => {
  const userPromise = User.findOne({ id: userId }, { _id: 0, id: 1, givenName: 1, familyName: 1 })
  const tripPromise = Trip.findOne({ id: tripId }, { _id: 0, id: 1, title: 1, ownerId: 1 })
  const [user, trip] = await Promise.all([userPromise, tripPromise])
  // existed user && existed trip && do not like your own trip
  if (user !== null && trip !== null && userId !== trip.ownerId) {
    const noti = {
      userId: trip.ownerId,
      type: notiTypes.LIKE,
      content: `<b>${user.givenName} ${user.familyName}</b> liked your trip: "${trip.title}".`,
      url: `/trip/${(trip as ITrip).id}`
    }
    handleSaveNoti(noti)
  }
}

export const createUserInteractNoti = async (followerId: string, followingId: string): Promise<void> => {
  const user = await User.findOne({ id: followerId }, { _id: 0, id: 1, givenName: 1, familyName: 1 })
  // existed user && do not follow yourself
  if (user !== null && user.id !== followingId) {
    const noti = {
      userId: followingId,
      type: notiTypes.FOLLOW,
      content: `<b>${user.givenName} ${user.familyName}</b> started following you.`,
      url: `/profile/${(user as IUser).id}`
    }
    handleSaveNoti(noti)
  }
}

const handleSaveNoti = (noti: any): void => {
  void getNoti(noti)
  // prevent duplicated notifications
    .then((value) => {
      const newNoti = {
        ...noti,
        isSeen: false,
        createdAt: new Date()
      }
      if (value !== null) {
        void updateNoti({ id: value.id }, newNoti)
          .then(e => { e !== null && sendNoti({ id: e.id, ...newNoti }) })
      } else {
        void createNoti({ id: uid(), ...newNoti })
          .then(e => { sendNoti(e) })
      }
    })
}

export const updateNoti = async (filters: any, data: any): Promise<INoti | null> => {
  const noti = await Noti.findOneAndUpdate(omitIsNil(filters), data)
  return noti
}

export const getNoti = async (filters: any): Promise<INoti | null> => {
  const noti = await Noti.findOne(omitIsNil(filters), { _id: 0 })
  return noti === null ? noti : await noti.toObject()
}

export const getNotis = async (filters: any): Promise<INoti[]> => {
  const notis = await Noti.find(omitIsNil(filters), { _id: 0 }).sort({ createdAt: -1 })
  return notis
}

export const updateAllNotis = async (filters: any, data: any): Promise<any> => {
  const notis = await Noti.updateMany(omitIsNil(filters), data)
  return notis
}
