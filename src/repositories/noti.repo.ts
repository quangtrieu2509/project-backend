/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { uid } from 'uid'
import { Booking, Item, Noti, Review, Trip, User } from '../models'
import type { INoti, IReview, ITrip, IUser } from '../types'
import { omitIsNil } from '../utils'
import { bookingStates, ItemStates, notiTypes } from '../constants'
import { sendNoti } from '../routers/socket.route'
import { ReviewStates } from '../constants/review-states'
import { itemMailer, reviewMailer } from '../mailer'

export const createNoti = async (noti: INoti): Promise<INoti> => {
  const newNoti = await Noti.create(noti)
  return await newNoti.toObject()
}

export const createNewBookingNoti = async (bookingId: string, itemId: string): Promise<void> => {
  const item = await Item.findOne({ id: itemId }, { _id: 0, id: 1, ownerId: 1, name: 1, type: 1 })

  // existed item
  if (item !== null) {
    const noti = {
      userId: item.ownerId,
      type: notiTypes.BOOKING,
      content: `Your ${item.type} <b>${item.name}</b> had a new booking: <span class="font-semibold">${bookingId}</span>.`,
      url: `/business/${item.id}?tab=bookings`
    }
    handleSaveNoti(noti)
  }
}

export const createUserBookingNoti = async (bookingId: string, state: string): Promise<void> => {
  const booking = await Booking.aggregate([
    {
      $match: { id: bookingId }
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemId',
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $project: {
        _id: 0,
        id: 1,
        userId: 1,
        item: { $arrayElemAt: ['$item', 0] }
      }
    }
  ])

  // existed booking
  if (booking.length !== 0) {
    const b = booking[0]

    if (state === bookingStates.CONFIRMED) {
      const noti = {
        userId: b.userId,
        type: notiTypes.APPROVE,
        content: `Your booking <span class="font-semibold">${b.id}</span> was confirmed by <b>${b.item.name}</b>.`,
        url: '/bookings?tab=confirmed'
      }
      handleSaveNoti(noti)
    } else if (state === bookingStates.CANCELLED) {
      const noti = {
        userId: b.userId,
        type: notiTypes.DECLINE,
        content: `Your booking <span class="font-semibold">${b.id}</span> was cancelled by <b>${b.item.name}</b>.`,
        url: '/bookings?tab=cancelled'
      }
      handleSaveNoti(noti)
    }
  }
}

export const createBizBookingNoti = async (bookingId: string, state: string): Promise<void> => {
  const booking = await Booking.aggregate([
    {
      $match: { id: bookingId }
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemId',
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              ownerId: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $project: {
        _id: 0,
        id: 1,
        item: { $arrayElemAt: ['$item', 0] }
      }
    }
  ])

  // existed booking && user cancelled booking
  if (booking !== null && state === bookingStates.CANCELLED) {
    const b = booking[0]
    const noti = {
      userId: b.item.ownerId,
      type: notiTypes.DECLINE,
      content: `The booking <span class="font-semibold">${b.id}</span> of <b>${b.item.name}</b> was cancelled by user.`,
      url: `/business/${b.item.id}?tab=bookings&state=cancelled`
    }
    handleSaveNoti(noti)
  }
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

export const createReviewInteractNoti = async (userId: string, reviewId: string): Promise<void> => {
  const userPromise = User.findOne({ id: userId }, { _id: 0, id: 1, givenName: 1, familyName: 1 })
  const rvPromise = Review.findOne({ id: reviewId }, { _id: 0, id: 1, content: 1, userId: 1 })
  const [user, review] = await Promise.all([userPromise, rvPromise])
  // existed user && existed trip && do not like your own trip
  if (user !== null && review !== null && userId !== review.userId) {
    const noti = {
      userId: review.userId,
      type: notiTypes.LIKE,
      content: `<b>${user.givenName} ${user.familyName}</b> liked your review: "${review.content}".`,
      url: `/review/${(review as IReview).id}`
    }
    handleSaveNoti(noti)
  }
}

export const createItemStateNoti = async (itemId: string, state: string): Promise<void> => {
  const item = await Item.aggregate([
    {
      $match: { id: itemId }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'ownerId',
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              familyName: 1,
              email: 1
            }
          }
        ],
        as: 'owner'
      }
    },
    {
      $project: {
        _id: 0,
        id: 1,
        type: 1,
        name: 1,
        owner: { $arrayElemAt: ['$owner', 0] }
      }
    }
  ])

  // existed item
  if (item.length !== 0) {
    const i = item[0]
    if (state === ItemStates.ACTIVE) {
      const noti = {
        userId: i.owner.id,
        type: notiTypes.APPROVE,
        content: `Admin ${notiTypes.APPROVE}d your ${i.type} item <b>${i.name}</b>.`,
        url: `/${i.type}/${i.id}`
      }
      handleSaveNoti(noti)
      itemMailer.sendApprovedItemMail(i.owner.email, i.owner.familyName, i.name)
    } else if (state === ItemStates.INACTIVE) {
      const noti = {
        userId: i.owner.id,
        type: notiTypes.DECLINE,
        content: `Admin ${notiTypes.DECLINE}d your ${i.type} item <b>${i.name}</b>.`,
        url: `/business/${i.id}`
      }
      handleSaveNoti(noti)
      itemMailer.sendDeclinedItemMail(i.owner.email, i.owner.familyName, i.name)
    }
  }
}

export const createReviewStateNoti = async (reviewId: string, state: string): Promise<void> => {
  const review = await Review.aggregate([
    {
      $match: { id: reviewId }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              familyName: 1,
              email: 1
            }
          }
        ],
        as: 'user'
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemId',
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $project: {
        _id: 0,
        id: 1,
        content: 1,
        user: { $arrayElemAt: ['$user', 0] },
        item: { $arrayElemAt: ['$item', 0] }
      }
    }
  ])

  // existed review
  if (review.length !== 0) {
    const rv = review[0]
    if (state === ReviewStates.ACTIVE) {
      const noti = {
        userId: rv.user.id,
        type: notiTypes.APPROVE,
        content: `Admin ${notiTypes.APPROVE}d your review: "${rv.content}".`,
        url: `/review/${rv.id}`
      }
      handleSaveNoti(noti)
      reviewMailer.sendApprovedReviewMail(rv.user.email, rv.user.familyName, rv.item.name)
    } else if (state === ItemStates.INACTIVE) {
      const noti = {
        userId: rv.user.id,
        type: notiTypes.DECLINE,
        content: `Admin ${notiTypes.DECLINE}d your review: "${rv.content}".`
      }
      handleSaveNoti(noti)
      reviewMailer.sendDeclinedReviewMail(rv.user.email, rv.user.familyName, rv.item.name)
    }
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
