import { uid } from 'uid'

import { Review } from '../models'
import type { IReview } from '../types'

export const createReview = async (review: IReview): Promise<IReview> => {
  const newReview = new Review({ ...review, id: uid() })
  return await newReview.save()
}
