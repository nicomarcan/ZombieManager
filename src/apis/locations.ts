import {Location} from '../model'

export default class LocationsApi{
  getLocationsWithoutZombies(): Promise<Location[]>{
    return fetch('http://localhost:3001/locations')
    .then(res => res.json())
    .then((data) => {
      return data;
    });
  }

  addLocation(location: Location): Promise<Location>{
    const body = this.generateBody(location);
    const config: RequestInit =  {
      method: 'POST', 
      body: body
    }
    return fetch('http://localhost:3001/locations', config)
    .then(res => res.json())
    .then((data) => {
      return data;
    });
  }
  deleteLocation(location: Location): Promise<Location>{
    const config: RequestInit =  {
      method: 'DELETE', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(location)
    }
    return fetch('http://localhost:3001/locations', config)
    .then(res => res.json())
    .then((data) => {
      return data;
    });
  }

  generateBody(location: Location){
    var formData = new FormData();
    location.pictures.map((image, index) => {
      formData.append(`image${index}`, image);
    });
    formData.append('title', location.title);
    formData.append('description', location.description);
    return formData;
  }
}



