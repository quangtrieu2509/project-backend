import { uid } from 'uid'
import { itemTypes } from '../constants'
import { Accomm, Activity, Attraction, Dinning, Item, Location } from '../models'
import type { ILocation } from '../types'
import { omitIsNil } from '../utils'

export const createItem = async (item: any): Promise<any> => {
  const newItem = await Item.create(item)
  switch (newItem.type) {
    case itemTypes.ATTRACTION: {
      const newAttraction = await Attraction.create({ ...item, id: uid(), itemId: newItem.id })
      return { ...newItem.toObject(), ...newAttraction.toObject() }
    }
    case itemTypes.ACCOMM: {
      const newAccomm = await Accomm.create({ ...item, id: uid(), itemId: newItem.id })
      return { ...newItem.toObject(), ...newAccomm.toObject() }
    }
    case itemTypes.DINING: {
      const newDining = await Dinning.create({ ...item, id: uid(), itemId: newItem.id })
      return { ...newItem.toObject(), ...newDining.toObject() }
    }
    case itemTypes.ACTIVITY: {
      const newActivity = await Activity.create({ ...item, id: uid(), itemId: newItem.id })
      return { ...newItem.toObject(), ...newActivity.toObject() }
    }
  }
}

export const getLocation = async (filters: any): Promise<ILocation | null> => {
  const loc = await Location.findOne(omitIsNil(filters), { _id: 0 })
  return loc === null ? loc : await loc.toObject()
}
