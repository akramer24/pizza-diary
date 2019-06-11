import axios from 'axios';
import { yelpAPIKey } from '../secrets';

const getTheClassics = async db => {
  try {
    const pizzerias = await axios.get('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `BEARER ${yelpAPIKey}`,
      },
      params: {
        term: 'pizza',
        location: 'new york city',
        limit: 50,
        sort_by: 'rating'
      }
    })

    pizzerias.data.businesses.forEach(async pizzeria => {
      const { id, name, price, rating, review_count, location, coordinates, display_phone } = pizzeria;
      await db.collection('pizzerias').doc(name).set({
        yelpId: id,
        name,
        price,
        yelpRating: rating,
        yelpReviewCount: review_count,
        address: location.display_address ? location.display_address : null,
        city: location.city,
        zip: location.zip_code,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        phone: display_phone
      })
    })

  } catch (err) {
    console.log(err)
  }
}

export default getTheClassics;